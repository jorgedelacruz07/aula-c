/*
 * =============================================================================
 *  SELECTOR DE EJERCICIOS PARA XCODE  (archivo de herramienta)
 * =============================================================================
 *  El target "MyTool" de Xcode compila TODOS los .c de la carpeta MyTool/.
 *  Si los 15 ejercicios estuvieran aquí, habría 15 funciones main y el enlazador
 *  fallaría con: duplicate symbol '_main'.
 *
 *  Solución: los ejercicios viven en ../ejercicios/ (fuera del target) y este
 *  archivo INCLUYE solo uno de ellos. Así el target tiene un único main y se
 *  puede usar el depurador de Xcode (breakpoints, pila de llamadas, punteros).
 *
 *  ¿Cómo cambiar de ejercicio?
 *    1. Cambia el valor de EJERCICIO abajo:
 *         - Bloque original  : 1, 2, 3, 4, 5   (o ej1, ej2, ej3, ej4, ej5)
 *         - Nivel Básico     : b1, b2, b3
 *         - Nivel Intermedio : i1, i2, i3
 *         - Nivel Avanzado   : a1, a2, a3, a4
 *    2. Cmd + R para compilar y ejecutar. Escribe los datos en la consola
 *       de Xcode (panel inferior derecho).
 *    3. Para poner breakpoints, abre el archivo de ejercicios/ en Xcode
 *       (ver README.md) y haz clic en el número de línea.
 *
 *  Nota: incluir un .c con #include es únicamente un selector de proyecto.
 *  En una evaluación se entrega un único archivo .c autónomo como los de ejercicios/.
 * =============================================================================
 */

/* Identificadores simbólicos para poder escribir ej1..ej5, b1..b3, i1..i3, a1..a4 */
#define ej1 1
#define ej2 2
#define ej3 3
#define ej4 4
#define ej5 5
#define EJ1 1
#define EJ2 2
#define EJ3 3
#define EJ4 4
#define EJ5 5

#define b1  101
#define b2  102
#define b3  103
#define B1  101
#define B2  102
#define B3  103

#define i1  201
#define i2  202
#define i3  203
#define I1  201
#define I2  202
#define I3  203

#define a1  301
#define a2  302
#define a3  303
#define a4  304
#define A1  301
#define A2  302
#define A3  303
#define A4  304

/* =============================================================================
 *  ELIGE AQUI EL EJERCICIO A EJECUTAR CON Cmd + R
 *  Opciones: 1..5 (o ej1..ej5) | b1, b2, b3 | i1, i2, i3 | a1, a2, a3, a4
 * ============================================================================= */
#define EJERCICIO b1

/* Los ejercicios usan "int main()" como pide el curso; Xcode activa
   -Wstrict-prototypes y avisaría. Se silencia solo aquí, no en los ejercicios. */
#pragma clang diagnostic ignored "-Wstrict-prototypes"

#if EJERCICIO == 1
#define RUTA_EJERCICIO "../ejercicios/ej1_secuencia_digitos.c"
#elif EJERCICIO == 2
#define RUTA_EJERCICIO "../ejercicios/ej2_sucesiones_y_sumatorias.c"
#elif EJERCICIO == 3
#define RUTA_EJERCICIO "../ejercicios/ej3_lotes_y_contadores_ref.c"
#elif EJERCICIO == 4
#define RUTA_EJERCICIO "../ejercicios/ej4_rotacion_y_bases.c"
#elif EJERCICIO == 5
#define RUTA_EJERCICIO "../ejercicios/ej5_riemann_y_limites.c"
#elif EJERCICIO == 101
#define RUTA_EJERCICIO "../ejercicios/basico/b1_polinomio_completo.c"
#elif EJERCICIO == 102
#define RUTA_EJERCICIO "../ejercicios/basico/b2_mcm_y_pi_wallis.c"
#elif EJERCICIO == 103
#define RUTA_EJERCICIO "../ejercicios/basico/b3_tres_consecutivos.c"
#elif EJERCICIO == 201
#define RUTA_EJERCICIO "../ejercicios/intermedio/i1_collatz_y_catalanes.c"
#elif EJERCICIO == 202
#define RUTA_EJERCICIO "../ejercicios/intermedio/i2_intervalos_y_rectas.c"
#elif EJERCICIO == 203
#define RUTA_EJERCICIO "../ejercicios/intermedio/i3_lab_2025_1_sucesionB.c"
#elif EJERCICIO == 301
#define RUTA_EJERCICIO "../ejercicios/avanzado/a1_numeros_felices_primos.c"
#elif EJERCICIO == 302
#define RUTA_EJERCICIO "../ejercicios/avanzado/a2_validar_password_6_cifras.c"
#elif EJERCICIO == 303
#define RUTA_EJERCICIO "../ejercicios/avanzado/a3_zuckerman_y_casa_lucas.c"
#elif EJERCICIO == 304
#define RUTA_EJERCICIO "../ejercicios/avanzado/a4_centro_masa_y_sumatorias.c"
#else
#error "EJERCICIO invalido: usa 1..5 (o ej1..ej5), b1..b3, i1..i3, o a1..a4"
#endif

/* Se limpian los alias antes del #include para no colisionar con variables
   locales de los ejercicios (como a1, a2, b1, b2 en i2_intervalos_y_rectas.c). */
#undef ej1
#undef ej2
#undef ej3
#undef ej4
#undef ej5
#undef EJ1
#undef EJ2
#undef EJ3
#undef EJ4
#undef EJ5
#undef b1
#undef b2
#undef b3
#undef B1
#undef B2
#undef B3
#undef i1
#undef i2
#undef i3
#undef I1
#undef I2
#undef I3
#undef a1
#undef a2
#undef a3
#undef a4
#undef A1
#undef A2
#undef A3
#undef A4

#ifdef RUTA_EJERCICIO
#include RUTA_EJERCICIO
#endif
