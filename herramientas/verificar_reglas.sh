#!/bin/sh
# Perfiles académicos: rutas antiguas = Parcial (Guías 1-6); anidados = Guías 8-9.
# clang -dump-tokens omite comentarios y permite auditar tokens del propio archivo.
total=0
if [ "$#" -eq 0 ]; then set -- ejercicios/*.c ejercicios/basico/*.c ejercicios/intermedio/*.c ejercicios/avanzado/*.c ejercicios/anidados/basico/*.c ejercicios/anidados/intermedio/*.c ejercicios/anidados/avanzado/*.c; fi
for archivo in "$@"; do
    [ -f "$archivo" ] || continue
    nombre=$(basename "$archivo"); errores=0; perfil=parcial
    case "$archivo" in *ejercicios/anidados/*) perfil=anidados ;; esac
    incl=$(grep -nE '^[[:space:]]*#[[:space:]]*include' "$archivo" | grep -vE '<(stdio|math|stdlib)\.h>')
    if [ -n "$incl" ]; then echo "  [$nombre] include no permitido: $incl"; errores=$((errores+1)); fi
    tokens=$(clang -fsyntax-only -Xclang -dump-tokens "$archivo" 2>&1 | grep "Loc=<$archivo:")
    if [ "$perfil" = parcial ]; then
        regex="^(for|do|switch|case|break|continue|goto|float|struct|union|long|short|unsigned|l_square) |^identifier '(bool|malloc|calloc|realloc|free)'"
    else
        regex="^(do|switch|case|float|struct|l_square) |^identifier '(bool|malloc|calloc|realloc|free)'"
    fi
    prohibidos=$(echo "$tokens" | grep -E "$regex" | sed -E "s/^[a-z_]+ '([^']*)'.*Loc=<[^:]+:([0-9]+):.*/'\1' en la linea \2/")
    if [ -n "$prohibidos" ]; then
        echo "$prohibidos" | while read -r linea; do echo "  [$nombre] construccion prohibida: $linea"; done
        errores=$((errores+$(echo "$prohibidos" | wc -l | tr -d ' ')))
    fi
    if [ "$perfil" = anidados ] && grep -Eq '(^|[^[:alnum:]_])char[[:space:]]*\*' "$archivo"; then echo "  [$nombre] no se permiten cadenas char *"; errores=$((errores+1)); fi
    mains=$(echo "$tokens" | grep -c "^identifier 'main'")
    if [ "$mains" -ne 1 ]; then echo "  [$nombre] se esperaba 1 main y hay $mains"; errores=$((errores+1)); fi
    if [ "$perfil" = anidados ]; then
        bucles=$(echo "$tokens" | grep -Ec '^(for|while) ')
        if [ "$bucles" -lt 2 ]; then echo "  [$nombre] se requieren al menos dos estructuras iterativas"; errores=$((errores+1)); fi
        linea_main=$(grep -nE '^[[:space:]]*int[[:space:]]+main[[:space:]]*\(' "$archivo" | head -1 | cut -d: -f1)
        linea_proto=$(grep -nE '^[[:space:]]*(void|int|double)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*[[:space:]]*\([^;]*\)[[:space:]]*;' "$archivo" | head -1 | cut -d: -f1)
        if [ -z "$linea_main" ] || [ -z "$linea_proto" ] || [ "$linea_proto" -ge "$linea_main" ]; then echo "  [$nombre] se requiere prototipo antes de main"; errores=$((errores+1)); fi
        globals=$(awk 'BEGIN{depth=0} /^[[:space:]]*#/ {next} {if(depth==0 && $0 ~ /^[[:space:]]*(static[[:space:]]+|extern[[:space:]]+|const[[:space:]]+|volatile[[:space:]]+)*(int|double|char|float)[[:space:]]+[*]*[A-Za-z_][A-Za-z0-9_]*[[:space:]]*(=|;|,)/) print NR ":" $0; opens=gsub(/{/,"{"); closes=gsub(/}/,"}"); depth+=opens-closes}' "$archivo")
        if [ -n "$globals" ]; then echo "  [$nombre] no se permiten variables globales: $globals"; errores=$((errores+1)); fi
    fi
    if [ "$errores" -eq 0 ]; then echo "  OK  $nombre ($perfil)"; fi
    total=$((total+errores))
done
if [ "$total" -ne 0 ]; then echo "Se encontraron $total infracciones."; exit 1; fi
echo "Todos los archivos cumplen su perfil académico."
