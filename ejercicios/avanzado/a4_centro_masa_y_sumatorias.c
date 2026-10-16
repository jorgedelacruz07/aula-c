/*
 * =============================================================================
 *  EJERCICIO A4 - CENTRO DE MASA 2D Y SUMATORIA CON ERRORES COMBINADOS
 *  Guía PUCP 2.3.7 (Centro de Masa 2D) y 2.3.8 (Sumatoria A - Lab 5 2021-2)
 *  Nivel : Avanzado (Prohibición de anidamiento + múltiples errores simultáneos)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Parte 1 (Centro de Masa 2D - Guía 2.3.7):
 *    Calcular las coordenadas (x_cm, y_cm) del centro de masa de una lámina
 *    plana homogénea delimitada superiormente por la parábola:
 *       f(x) = a * x^2 + b * x + c   (con f(x) >= 0 en [xi, xf])
 *    e inferiormente por el eje X, desde x = xi hasta x = xf, discretizando
 *    en rectángulos de ancho dx = 0.001:
 *       Area  = Sum [ f(x) * dx ]
 *       x_cm  = (1 / Area) * Sum [ x * f(x) * dx ]
 *       y_cm  = (1 / Area) * Sum [ 0.5 * (f(x))^2 * dx ]
 *    RESTRICCIÓN ESTRICTA: Prohibido usar estructuras selectivas o iterativas
 *    anidadas. Devolver las coordenadas mediante punteros en:
 *       void calcular_centro_masa(double a, double b, double c,
 *                                 double xi, double xf,
 *                                 double *ptr_x_centro_masa,
 *                                 double *ptr_y_centro_masa);
 *
 *  Parte 2 (Sumatoria A del Lab 5 2021-2 - Guía 2.3.8):
 *    Leer dos enteros 'a' y 'b' y un real 'x'. Validar las 3 condiciones:
 *      1) 'a' pertenece al rango cerrado [2, 6]
 *      2) 'b' pertenece al rango cerrado [1, 5]
 *      3) Se cumple que a > b
 *    Si fallan una, dos o las tres condiciones simultáneamente, el programa
 *    debe imprimir TODOS los mensajes de error que correspondan (sin anidar ifs).
 *    Si todo es válido, calcular la Sumatoria A desde i = b hasta i = a:
 *       Sum_{i=b..a} [ ((-1)^(i+1) * (a + b)^i * x^i) / (2i)! ]
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* --- Módulos de la Parte 1: Centro de Masa 2D --- */
double evaluar_parabola(double a, double b, double c, double x);
void calcular_centro_masa(double a, double b, double c, double xi, double xf,
                          double *ptr_x_centro_masa, double *ptr_y_centro_masa);

/* --- Módulos de la Parte 2: Sumatoria A (Lab 5 2021-2) --- */
int validar_parametros_sumatoria(int a, int b);
double calcular_factorial_doble(int n);
double calcular_termino_sumatoria(int a, int b, double x, int i);
double evaluar_sumatoria_A(int a, int b, double x);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    double a_par, b_par, c_par, xi, xf;
    double x_cm, y_cm;
    int a_sum, b_sum;
    double x_val, resultado_sum;

    /* -------------------- PARTE 1: CENTRO DE MASA -------------------- */
    printf("=== PARTE 1: CENTRO DE MASA 2D DE UNA LAMINA PARABOLICA ===\n");
    printf("Ingrese los coeficientes a, b, c de f(x) = ax^2 + bx + c: ");
    scanf("%lf %lf %lf", &a_par, &b_par, &c_par);
    printf("Ingrese los limites de integracion xi y xf (xi < xf): ");
    scanf("%lf %lf", &xi, &xf);

    if (xi < xf) {
        calcular_centro_masa(a_par, b_par, c_par, xi, xf, &x_cm, &y_cm);
        printf("Centro de masa (x_cm, y_cm): (%.4lf, %.4lf)\n", x_cm, y_cm);
    } else {
        printf("Error en Centro de Masa: se requiere xi < xf\n");
    }

    /* -------------------- PARTE 2: SUMATORIA LAB 2021-2 -------------- */
    printf("\n=== PARTE 2: SUMATORIA A (VALIDACION CON ERRORES COMBINADOS) ===\n");
    printf("Ingrese los enteros a (en [2, 6]), b (en [1, 5], con a > b) y el real x: ");
    scanf("%d %d %lf", &a_sum, &b_sum, &x_val);

    if (validar_parametros_sumatoria(a_sum, b_sum)) {
        resultado_sum = evaluar_sumatoria_A(a_sum, b_sum, x_val);
        printf("El valor de la Sumatoria A es: %.6lf\n", resultado_sum);
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * FUNCIÓN evaluar_parabola
 */
double evaluar_parabola(double a, double b, double c, double x) {
    return a * x * x + b * x + c;
}

/*
 * PROCEDIMIENTO calcular_centro_masa
 * Explicación del algoritmo de integración simultánea:
 * - Se discretiza el intervalo [xi, xf] en franjas verticales de base dx = 0.001
 *   y altura fx = f(x).
 * - En un único bucle while (sin anidar estructuras) se acumulan simultáneamente:
 *     1) El área total de la lámina:           suma_area      += fx * dx
 *     2) El momento estático respecto a Y:     suma_momento_x += x * fx * dx
 *     3) El momento estático respecto a X:     suma_momento_y += 0.5 * fx^2 * dx
 *        (pues el centroide de cada rectángulo vertical de altura fx está a
 *         una altura 0.5 * fx).
 * - Al finalizar el bucle, se asignan ambas coordenadas en las direcciones de
 *   memoria '*ptr_x_centro_masa' y '*ptr_y_centro_masa'.
 */
void calcular_centro_masa(double a, double b, double c, double xi, double xf,
                          double *ptr_x_centro_masa, double *ptr_y_centro_masa) {
    double dx = 0.001;
    double x, fx;
    double suma_area, suma_momento_x, suma_momento_y;

    suma_area = 0.0;
    suma_momento_x = 0.0;
    suma_momento_y = 0.0;
    x = xi;

    while (x <= xf) {
        fx = evaluar_parabola(a, b, c, x);
        suma_area = suma_area + fx * dx;
        suma_momento_x = suma_momento_x + x * fx * dx;
        suma_momento_y = suma_momento_y + 0.5 * fx * fx * dx;
        x = x + dx;
    }

    *ptr_x_centro_masa = suma_momento_x / suma_area;
    *ptr_y_centro_masa = suma_momento_y / suma_area;
}

/*
 * FUNCIÓN validar_parametros_sumatoria
 * Patrón de validación con múltiples mensajes de error simultáneos:
 * - Si se utilizara una estructura 'if / else if', el programa solo mostraría
 *   el primer error encontrado e ignoraría los demás.
 * - Al emplear tres sentencias 'if' independientes (sin 'else' entre ellas),
 *   cada condición se evalúa por separado. Si fallan dos o las tres reglas a
 *   la vez, se imprimen todos los mensajes correspondientes y la bandera
 *   'es_valido' queda en 0, sin necesidad de anidar condicionales.
 */
int validar_parametros_sumatoria(int a, int b) {
    int es_valido = 1;

    if (a < 2 || a > 6) {
        printf("Error: 'a' no pertenece al rango requerido [2, 6]\n");
        es_valido = 0;
    }

    if (b < 1 || b > 5) {
        printf("Error: 'b' no pertenece al rango requerido [1, 5]\n");
        es_valido = 0;
    }

    if (a <= b) {
        printf("Error: no se cumple la condicion a > b\n");
        es_valido = 0;
    }

    return es_valido;
}

/*
 * FUNCIÓN calcular_factorial_doble
 */
double calcular_factorial_doble(int n) {
    double fact = 1.0;
    int k = 1;

    while (k <= n) {
        fact = fact * k;
        k = k + 1;
    }

    return fact;
}

/*
 * FUNCIÓN calcular_termino_sumatoria
 * Expresiones clave de C:
 * - 'signo = pow(-1.0, i + 1)': alterna el signo (+1.0 cuando i es impar, -1.0
 *   cuando i es par).
 * - 'pow((double)(a + b), i)': el cast '(double)' convierte la suma entera
 *   (a + b) a punto flotante para pasarla como primer argumento de 'pow'.
 * - El cálculo de (2i)! se delega a 'calcular_factorial_doble(2 * i)' para no
 *   anidar un bucle dentro del bucle de 'evaluar_sumatoria_A'.
 */
double calcular_termino_sumatoria(int a, int b, double x, int i) {
    double signo, numerador, denominador;

    signo = pow(-1.0, i + 1);
    numerador = signo * pow((double)(a + b), i) * pow(x, i);
    denominador = calcular_factorial_doble(2 * i);

    return numerador / denominador;
}

/*
 * FUNCIÓN evaluar_sumatoria_A
 */
double evaluar_sumatoria_A(int a, int b, double x) {
    double suma = 0.0;
    int i = b;

    while (i <= a) {
        suma = suma + calcular_termino_sumatoria(a, b, x, i);
        i = i + 1;
    }

    return suma;
}
