#!/bin/sh
# Verifica que cada ejercicio cumpla las reglas del curso 1INF01 (PUCP).
# Usa el lexer de clang (-dump-tokens), así que IGNORA los comentarios:
# la palabra "for" o "break" dentro de un comentario no es una infracción.
#
# Uso: sh herramientas/verificar_reglas.sh ejercicios/*.c

total=0

for archivo in "$@"; do
    nombre=$(basename "$archivo")
    errores=0

    # 1. Solo se permiten <stdio.h>, <math.h> y <stdlib.h>
    incl=$(grep -nE '^[[:space:]]*#[[:space:]]*include' "$archivo" \
           | grep -vE '<(stdio|math|stdlib)\.h>')
    if [ -n "$incl" ]; then
        echo "  [$nombre] include no permitido: $incl"
        errores=$((errores + 1))
    fi

    # 2. Tokens prohibidos (solo los del propio archivo, no los de los headers)
    tokens=$(clang -fsyntax-only -Xclang -dump-tokens "$archivo" 2>&1 \
             | grep "Loc=<$archivo:")

    prohibidos=$(echo "$tokens" | grep -E \
        "^(for|do|switch|case|break|continue|goto|float|struct|union|long|short|unsigned|l_square) |^identifier '(bool|malloc|calloc|realloc|free)'" \
        | sed -E "s/^[a-z_]+ '([^']*)'.*Loc=<[^:]+:([0-9]+):.*/'\1' en la linea \2/")
    if [ -n "$prohibidos" ]; then
        echo "$prohibidos" | while read -r linea; do
            echo "  [$nombre] construccion prohibida: $linea"
        done
        errores=$((errores + $(echo "$prohibidos" | wc -l)))
    fi

    # 3. Debe existir exactamente un main
    mains=$(echo "$tokens" | grep -c "^identifier 'main'")
    if [ "$mains" -ne 1 ]; then
        echo "  [$nombre] se esperaba 1 main y hay $mains"
        errores=$((errores + 1))
    fi

    if [ "$errores" -eq 0 ]; then
        echo "  OK  $nombre"
    fi
    total=$((total + errores))
done

if [ "$total" -ne 0 ]; then
    echo "Se encontraron $total infracciones."
    exit 1
fi
echo "Todos los archivos cumplen las reglas del curso."
