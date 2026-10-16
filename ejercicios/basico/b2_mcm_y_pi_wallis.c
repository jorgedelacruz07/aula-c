/*
 * =============================================================================
 *  EJERCICIO B2 - MCM (100 PRIMEROS MULTIPLOS) Y PRODUCTO DE WALLIS
 *  Guía PUCP 2.1.3 (MCM) y 2.1.9 (Aproximación de Pi por Wallis)
 *  Nivel : Básico (Búsqueda con bandera sin break + productoria en double)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Parte 1 (MCM - Guía 2.1.3):
 *    Leer dos enteros A y B (>= 2) y hallar su Mínimo Común Múltiplo (MCM)
 *    evaluando con un while únicamente los 100 primeros múltiplos del mayor
 *    de ellos, apoyándose en la función es_multiplo(int a, int b) que retorna
 *    1 o 0, y deteniendo la búsqueda con una variable bandera (sin usar break).
 *
 *  Parte 2 (Producto de Wallis - Guía 2.1.9):
 *    Implementar la función aproximar_pi_wallis(int terminos) que utilice la
 *    productoria de John Wallis:
 *       Prod_{n=1..k} [ (2n / (2n - 1)) * (2n / (2n + 1)) ] = Pi / 2
 *    Invocarla desde main dos veces: con 200 términos y con 2000 términos.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>

/* PROCEDIMIENTO: lee los dos enteros A y B por referencia. */
void leer_enteros(int *a, int *b);

/* FUNCIÓN: retorna 1 si 'a' es múltiplo exacto de 'b', 0 en caso contrario. */
int es_multiplo(int a, int b);

/* FUNCIÓN: busca el MCM entre los 100 primeros múltiplos del mayor (o -1 si no lo halla). */
int hallar_mcm_100(int a, int b);

/* FUNCIÓN: aproxima el valor de Pi usando la productoria de Wallis con 'terminos' factores. */
double aproximar_pi_wallis(int terminos);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int a, b, mcm;
    double pi_200, pi_2000;

    printf("=== PARTE 1: MINIMO COMUN MULTIPLO (100 PRIMEROS MULTIPLOS) ===\n");
    leer_enteros(&a, &b);

    if (a >= 2 && b >= 2) {
        mcm = hallar_mcm_100(a, b);
        if (mcm != -1) {
            printf("El MCM de %d y %d es: %d\n", a, b, mcm);
        } else {
            printf("No se encontro el MCM entre los 100 primeros multiplos del mayor\n");
        }
    } else {
        printf("Datos incorrectos: A y B deben ser mayores o iguales a 2\n");
    }

    printf("\n=== PARTE 2: APROXIMACION DE PI CON PRODUCTO DE WALLIS ===\n");
    pi_200 = aproximar_pi_wallis(200);
    pi_2000 = aproximar_pi_wallis(2000);

    printf("Pi aproximado con 200 terminos  : %.6lf\n", pi_200);
    printf("Pi aproximado con 2000 terminos : %.6lf\n", pi_2000);

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_enteros
 * 'a' y 'b' son punteros (int *), por lo que ya contienen las direcciones de
 * memoria de las variables de main y se pasan a scanf sin '&'.
 */
void leer_enteros(int *a, int *b) {
    printf("Ingrese dos numeros enteros A y B (mayores o iguales a 2): ");
    scanf("%d %d", a, b);
}

/*
 * FUNCIÓN es_multiplo
 * Un entero 'a' es múltiplo de 'b' si el residuo de la división entera 'a % b'
 * es exactamente 0. Se verifica primero 'b != 0' para evitar dividir entre cero.
 */
int es_multiplo(int a, int b) {
    int resultado = 0;

    if (b != 0 && a % b == 0) {
        resultado = 1;
    }

    return resultado;
}

/*
 * FUNCIÓN hallar_mcm_100
 * Explicación del algoritmo:
 * - Todo múltiplo común de 'a' y 'b' es, en particular, múltiplo del mayor de
 *   ellos. Por ello se generan sucesivamente los múltiplos del mayor:
 *       candidato = mayor * 1, mayor * 2, ..., mayor * 100
 * - El primer 'candidato' que además sea múltiplo de 'menor' es el Mínimo Común
 *   Múltiplo (MCM).
 * - Expresión 'while (i <= 100 && !encontrado)':
 *   La variable bandera 'encontrado' inicia en 0 (falso), por lo que '!encontrado'
 *   vale 1 (verdadero). Apenas se halla el MCM, 'encontrado' cambia a 1,
 *   '!encontrado' pasa a 0 y el bucle termina en la siguiente evaluación sin
 *   necesidad de usar 'break'.
 */
int hallar_mcm_100(int a, int b) {
    int mayor, menor;
    int i, candidato, mcm, encontrado;

    if (a > b) {
        mayor = a;
        menor = b;
    } else {
        mayor = b;
        menor = a;
    }

    i = 1;
    mcm = -1;
    encontrado = 0;

    while (i <= 100 && !encontrado) {
        candidato = mayor * i;
        if (es_multiplo(candidato, menor)) {
            mcm = candidato;
            encontrado = 1;
        }
        i = i + 1;
    }

    return mcm;
}

/*
 * FUNCIÓN aproximar_pi_wallis
 * Explicación matemática y expresiones de C:
 * - Inicialización de una productoria ('productoria = 1.0'):
 *   Mientras que una sumatoria se inicializa en 0.0 (elemento neutro de la suma),
 *   una productoria debe inicializarse en 1.0 (elemento neutro de la
 *   multiplicación). Si iniciara en 0.0, el producto sería 0 para cualquier n.
 * - Prevención de división entera ('numerador = 2.0 * n'):
 *   Al multiplicar el entero 'n' por el literal real '2.0', C promueve el
 *   resultado a 'double'. Así las divisiones 'numerador / (numerador - 1.0)' y
 *   'numerador / (numerador + 1.0)' se ejecutan con decimales y no se truncan.
 * - Como la fórmula de Wallis converge a Pi / 2, se retorna '2.0 * productoria'.
 */
double aproximar_pi_wallis(int terminos) {
    int n;
    double productoria, numerador, factor_izq, factor_der;

    productoria = 1.0;
    n = 1;

    while (n <= terminos) {
        numerador = 2.0 * n;
        factor_izq = numerador / (numerador - 1.0);
        factor_der = numerador / (numerador + 1.0);
        productoria = productoria * factor_izq * factor_der;
        n = n + 1;
    }

    return 2.0 * productoria;
}
