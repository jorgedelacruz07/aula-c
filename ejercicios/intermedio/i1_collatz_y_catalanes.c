/*
 * =============================================================================
 *  EJERCICIO I1 - CONJETURA DE COLLATZ Y NUMEROS CATALANES
 *  Guía PUCP 2.2.1 (Collatz) y 2.2.3 (Números Catalanes)
 *  Nivel : Intermedio (Composición de módulos dentro de while + factorial double)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Implementar un menú que permita elegir entre:
 *    Opción 1 - Serie de Collatz (Guía 2.2.1):
 *      Leer un entero positivo n (>= 1). Mediante un bucle while (n != 1),
 *      generar e imprimir la serie de Collatz invocando a la función
 *      siguiente_collatz(int n), la cual devuelve n / 2 si n es par o
 *      3 * n + 1 si n es impar, llamando internamente a es_par(int n).
 *
 *    Opción 2 - Números Catalanes (Guía 2.2.3):
 *      Leer un entero i (>= 0) e imprimir con un while todos los números
 *      catalanes desde C_0 hasta C_i usando la fórmula combinatoria:
 *         C_k = (2k)! / ( (k + 1)! * k! )
 *      invocando múltiples veces a calcular_factorial(int n) en double.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>

/* PROCEDIMIENTO: muestra el menú y lee la opción elegida. */
void leer_opcion_menu(int *opcion);

/* FUNCIÓN: retorna 1 si n es par, 0 si es impar. */
int es_par(int n);

/* FUNCIÓN: retorna el siguiente término de la serie de Collatz (usa es_par). */
int siguiente_collatz(int n);

/* PROCEDIMIENTO: imprime toda la serie de Collatz hasta llegar a 1. */
void generar_serie_collatz(int n);

/* FUNCIÓN: calcula el factorial de n en double para evitar desbordamiento. */
double calcular_factorial(int n);

/* FUNCIÓN: calcula el k-ésimo número de Catalan llamando 3 veces a calcular_factorial. */
double calcular_catalan(int k);

/* PROCEDIMIENTO: imprime los números catalanes desde C_0 hasta C_i. */
void imprimir_catalanes_hasta(int i);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int opcion, n, indice_max;

    leer_opcion_menu(&opcion);

    if (opcion == 1) {
        printf("Ingrese un numero entero positivo para la serie de Collatz: ");
        scanf("%d", &n);
        if (n >= 1) {
            generar_serie_collatz(n);
        } else {
            printf("Error: el numero debe ser un entero positivo (n >= 1)\n");
        }
    } else if (opcion == 2) {
        printf("Ingrese el indice i (i >= 0) para los numeros Catalanes: ");
        scanf("%d", &indice_max);
        if (indice_max >= 0) {
            imprimir_catalanes_hasta(indice_max);
        } else {
            printf("Error: el indice i debe ser mayor o igual a 0\n");
        }
    } else {
        printf("Opcion invalida\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_opcion_menu
 */
void leer_opcion_menu(int *opcion) {
    printf("================ MENU PRINCIPAL ================\n");
    printf("  [1] Serie de Collatz\n");
    printf("  [2] Numeros Catalanes\n");
    printf("Ingrese una opcion: ");
    scanf("%d", opcion);
}

/*
 * FUNCIÓN es_par
 * El operador módulo ('%') devuelve el residuo de la división entera. Si
 * 'n % 2 == 0', el número es divisible entre 2 (par) y se retorna 1; de lo
 * contrario se retorna 0.
 */
int es_par(int n) {
    int resultado = 0;

    if (n % 2 == 0) {
        resultado = 1;
    }

    return resultado;
}

/*
 * FUNCIÓN siguiente_collatz
 * Composición modular: en lugar de repetir 'n % 2 == 0', este módulo invoca a
 * la función 'es_par(n)' como condición del 'if' y calcula el siguiente paso
 * de la conjetura de Collatz (n / 2 si es par, o 3 * n + 1 si es impar).
 */
int siguiente_collatz(int n) {
    int siguiente;

    if (es_par(n)) {
        siguiente = n / 2;
    } else {
        siguiente = 3 * n + 1;
    }

    return siguiente;
}

/*
 * PROCEDIMIENTO generar_serie_collatz
 * Bucle while controlado por condición ('n != 1'):
 * No se conoce de antemano cuántos pasos tardará 'n' en converger a 1.
 * Primero se imprime el término inicial y luego, mientras 'n' sea distinto de 1,
 * se actualiza 'n = siguiente_collatz(n)' y se imprime el nuevo valor.
 * Por ejemplo, para n = 6 la secuencia impresa es: 6 3 10 5 16 8 4 2 1.
 */
void generar_serie_collatz(int n) {
    printf("Serie de Collatz: %d", n);

    while (n != 1) {
        n = siguiente_collatz(n);
        printf(" %d", n);
    }

    printf("\n");
}

/*
 * FUNCIÓN calcular_factorial
 * Cálculo de n! en tipo 'double':
 * - En la fórmula de Catalan se necesita (2k)!. Ya para k = 7 se tiene
 *   14! = 87,178,291,200, valor que desborda un 'int' de 32 bits (máximo
 *   2,147,483,647). Usar 'double' permite representar factoriales grandes sin
 *   desbordamiento entero.
 * - Cuando n = 0, la condición 'k <= n' (1 <= 0) es falsa desde el inicio y la
 *   función retorna el valor inicial 'fact = 1.0', cumpliendo que 0! = 1.
 */
double calcular_factorial(int n) {
    double fact = 1.0;
    int k = 1;

    while (k <= n) {
        fact = fact * k;
        k = k + 1;
    }

    return fact;
}

/*
 * FUNCIÓN calcular_catalan
 * Evalúa C_k = (2k)! / ((k + 1)! * k!) reutilizando tres veces la función
 * 'calcular_factorial' con argumentos distintos: '2 * k', 'k + 1' y 'k'.
 * Además de evitar duplicar código, este diseño evita escribir bucles anidados.
 */
double calcular_catalan(int k) {
    double numerador, denominador;

    numerador = calcular_factorial(2 * k);
    denominador = calcular_factorial(k + 1) * calcular_factorial(k);

    return numerador / denominador;
}

/*
 * PROCEDIMIENTO imprimir_catalanes_hasta
 * Recorre k desde 0 hasta i con un bucle while.
 * Expresión de formato "%.0lf" en printf:
 * Imprime un valor de tipo 'double' redondeado a 0 cifras decimales (sin punto
 * decimal), ideal para cantidades combinatorias exactas almacenadas en 'double'.
 */
void imprimir_catalanes_hasta(int i) {
    int k = 0;
    double termino;

    printf("Numeros Catalanes desde C(0) hasta C(%d):\n", i);
    while (k <= i) {
        termino = calcular_catalan(k);
        printf("  C(%d) = %.0lf\n", k, termino);
        k = k + 1;
    }
}
