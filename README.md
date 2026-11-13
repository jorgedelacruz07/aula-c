# 1INF01 Fundamentos de Programación · Programación modular en C (PUCP)

Colección de 15 ejercicios tipo laboratorio de **1INF01 Fundamentos de Programación** (EEGGCC, PUCP), implementados bajo las reglas académicas del curso: ANSI C, únicamente bucle `while`, sin arreglos, sin `for`/`break`/`switch`, y con `main` como módulo coordinador.

```
C-Testing/
├── ejercicios/                 ← 15 programas autónomos (cada uno con su propio main)
│   ├── ej1_secuencia_digitos.c
│   ├── ej2_sucesiones_y_sumatorias.c
│   ├── ej3_lotes_y_contadores_ref.c
│   ├── ej4_rotacion_y_bases.c
│   ├── ej5_riemann_y_limites.c
│   ├── basico/
│   │   ├── b1_polinomio_completo.c
│   │   ├── b2_mcm_y_pi_wallis.c
│   │   └── b3_tres_consecutivos.c
│   ├── intermedio/
│   │   ├── i1_collatz_y_catalanes.c
│   │   ├── i2_intervalos_y_rectas.c
│   │   └── i3_lab_2025_1_sucesionB.c
│   └── avanzado/
│       ├── a1_numeros_felices_primos.c
│       ├── a2_validar_password_6_cifras.c
│       ├── a3_zuckerman_y_casa_lucas.c
│       └── a4_centro_masa_y_sumatorias.c
├── pruebas/                    ← entradas (.in) y salidas esperadas (.out) de cada caso
├── herramientas/verificar_reglas.sh   ← detecta for/break/switch/[]/float/struct...
├── MyTool/main.c               ← selector para ejecutar/depurar un ejercicio en Xcode
├── Makefile
└── GUIA_MENTOR_VIERNES.md      ← guía técnica de expresiones C y casos de prueba
```

## Opción A: Terminal

Abre Terminal.app en la carpeta del proyecto (en Finder: clic derecho sobre la carpeta → *Servicios → Nuevo Terminal en la carpeta*, o `cd ~/Downloads/C-Testing`):

```sh
make list       # muestra los 15 ejercicios disponibles por nivel
make ej1        # compila y ejecuta ej1 (igual ej2..ej5, b1..b3, i1..i3, a1..a4)
make all        # compila los 15 programas en build/
make test       # corre los 30 casos de pruebas/ y compara la salida exacta
make reglas     # revisa que los 15 archivos cumplan las restricciones del curso
make ansi       # verifica que compilen en ANSI C89 estricto (-std=c89 -pedantic)
make verify     # compila y ejecuta todas las comprobaciones de calidad
make clean      # borra build/
```

Ejecutar un caso concreto sin teclear los datos:

```sh
./build/ej1_secuencia_digitos < pruebas/ej1_caso1_suma.in
printf '97531 5\n+\n' | ./build/ej1_secuencia_digitos
```

Se compila con `clang -Wall -Wextra ... -lm`. Cada `.c` se compila **por separado**, así que nunca chocan los `main`.

## Opción B: Xcode (para usar el depurador)

### Por qué funciona así

El target **MyTool** usa una *carpeta sincronizada*: Xcode compila **todo** `.c` que esté dentro de `MyTool/`. Si se copiaran ahí todos los ejercicios habría múltiples funciones `main` y el enlazador fallaría con:

```
duplicate symbol '_main' in: ej1_....o  ej2_....o
```

Por eso los ejercicios están en `ejercicios/`, fuera del target, y `MyTool/main.c` es un **selector** que incluye uno solo.

### Uso

1. Abre `C-Testing.xcodeproj`.
2. En `MyTool/main.c` cambia la línea `#define EJERCICIO a1` por el identificador que quieras (`1`–`5`, `ej1`–`ej5`, `b1`–`b3`, `i1`–`i3` o `a1`–`a4`).
3. **Cmd + R**. Escribe los datos en la consola de Xcode (panel inferior; si no aparece, *View → Debug Area → Activate Console*, o Shift + Cmd + C).

### Breakpoints en los ejercicios

La carpeta `ejercicios` aparece en el navegador del proyecto (panel izquierdo) **sin pertenecer a ningún target**: se puede leer y editar, pero Xcode no la compila por separado. Si algún día marcas un ejercicio en *Target Membership* (inspector de archivo, panel derecho), vuelve el error `duplicate symbol '_main'`: déjalo desmarcado.

Haz clic en el número de línea de un ejercicio para poner un breakpoint. Como `main.c` incluye ese archivo, el breakpoint se activa normalmente.

Comandos útiles en la consola `(lldb)` al detener la ejecución:

```
bt                 # pila de llamadas: main -> procesar_mediciones -> clasificar_iluminancia
frame variable     # variables del frame actual
p &numero          # dirección de una variable de main
p num              # dentro de leer(): el puntero (la misma dirección)
p *num             # el valor al que apunta
up / down          # moverse entre frames de la pila
```

> **Importante:** el `#include "...c"` de `main.c` es solo un selector para Xcode. En una evaluación se entrega **un único `.c`** como los de `ejercicios/`, con únicamente `<stdio.h>`, `<math.h>` y `<stdlib.h>`.

## Reglas del curso aplicadas en todo el código

| Regla | Cómo se cumple |
|---|---|
| Solo `stdio.h`, `math.h`, `stdlib.h` | `make reglas` lo verifica |
| Solo `int`, `double`, `char` | sin `float`, `long`, `bool`, `struct`, arreglos |
| Solo `while` | sin `for`, `do-while`, `switch`, `break`, `continue` (banderas en la condición) |
| Contar cifras sin bucle | `(int)log10(num) + 1` tras validar `num > 0`, o rangos con `&&` |
| 3 zonas | includes + prototipos → `int main()` → definiciones |
| Funciones vs procedimientos | cada prototipo está etiquetado en un comentario |
| Factoriales en `double`, `1.0 / fact`, `fabs(a - b) < tol` | ver Ej2, I1, A4 y Ej5 |
| `scanf("%d", num)` sin `&` si `num` ya es puntero; `" %c"` con espacio | todos los módulos de lectura |

## Guías 8-9: ciclos iterativos anidados

Se añadieron diez programas autónomos en `ejercicios/anidados/`:

- `make nb1`, `make nb2`, `make nb3`: Pascal; tablas por dígito y pitagórica; primos gemelos, Armstrong y Mersenne.
- `make ni1`, `make ni2`, `make ni3`: Goldbach y fracciones; juego de capicúas y multibase; poderosos, intocables y secuencias con centinela.
- `make na1`, `make na2`, `make na3`, `make na4`: cambio de base especial; familias de primos; Lynch-Bell/Ormiston; odontológicos y triángulos.
- `make anidados` compila la batería; `make test_anidados` ejecuta sus casos guardados en `pruebas/anidados_*.in/.out`.
- `make reglas` valida los perfiles Parcial (Guías 1-6) y Anidados (Guías 8-9).
- `make web` sirve la plataforma en <http://localhost:8080>; detener con Ctrl-C.

### Plataforma para la sesión con Mauricio

Desde la raíz ejecuta `make web` y abre <http://localhost:8080>. El sitio no requiere npm ni proceso de build. Incluye el mapa comparativo de reglas, la traducción PSeInt/C, una simulación paso a paso de parámetros por referencia, diez recetas sin arreglos, el catálogo filtrable de fuentes del repo con guía línea a línea y pruebas copiables, y diez retos interactivos de depuración. Tailwind CSS y Prism.js se cargan desde CDN, por lo que se requiere conexión a Internet para esos estilos y el resaltado; el contenido y los programas permanecen locales.

### Límites didácticos de los ejemplos

Los casos añadidos son casos de regresión de esta práctica y no se presentan como transcripciones oficiales de evaluaciones PUCP. Cada ejercicio documenta en sus comentarios el perfil y la intención técnica. Revisar rangos y límites antes de adaptar los algoritmos a entradas mayores.
