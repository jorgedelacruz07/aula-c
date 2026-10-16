/*
 * =============================================================================
 *  EJERCICIO 2 - SUCESIONES Y SUMATORIAS
 *  Patrón: Menú + Recurrencia sin arreglos (variables deslizantes)
 *          + Sumatoria cuyo término se devuelve por 2 punteros
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO (resumido)
 *  Menú con 2 opciones (mayúscula o minúscula):
 *
 *  Z/z) Leer un entero en [0, 1000] y decir si pertenece a los 15 primeros
 *       términos (n = 0 .. 14) de la sucesión:
 *           Z(0) = 3,  Z(1) = 2,  Z(2) = 1
 *           Z(n) = Z(n-2) + Z(n-1) - Z(n-3)      para n >= 3
 *
 *  S/s) Leer a en [0, 2] (real) y n en [0, 10] (entero) y calcular:
 *
 *                 n   /  (3a)^i * (2i+1)!      1  \
 *           S =  SUM  | ------------------ +  --- |
 *                i=0  \       3 - a            i! /
 *
 *       El módulo de la sumatoria tiene el while y, en cada vuelta, llama a
 *       un PROCEDIMIENTO que calcula las 2 fracciones y las devuelve
 *       modificando 2 punteros (double *parte1, double *parte2).
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* PROCEDIMIENTO: lee la opción del menú por referencia. */
void leer_opcion(char *opcion);

/* PROCEDIMIENTO: coordina la opción Z (lee, valida, llama a la función e imprime). */
void procesar_opcion_z(void);

/* PROCEDIMIENTO: coordina la opción S (lee, valida, llama a la función e imprime). */
void procesar_opcion_s(void);

/* PROCEDIMIENTO: imprime los 15 primeros términos de Z (apoyo visual). */
void imprimir_terminos_z(void);

/* FUNCIÓN PURA (retorna int): 1 si x está entre Z(0)..Z(14), 0 si no. */
int pertenece_sucesion_z(int x);

/* PROCEDIMIENTO: lee a y n por referencia. */
void leer_datos_s(double *a, int *n);

/* FUNCIÓN (retorna double): valor de la sumatoria completa. */
double calcular_sumatoria(double a, int n);

/* PROCEDIMIENTO: calcula las 2 fracciones del término i y las devuelve por punteros. */
void calcular_terminos(double a, int i, double *parte1, double *parte2);

/* FUNCIÓN (retorna double): k! calculado con while. */
double factorial(int k);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    char opcion;

    leer_opcion(&opcion);

    /*
     * Selección de menú con cadena 'if / else if':
     * Se evalúa tanto el carácter en mayúscula como en minúscula usando el
     * operador lógico OR ('||'). Cada rama delega el trabajo a un procedimiento
     * específico para evitar anidar estructuras condicionales dentro de main.
     */
    if (opcion == 'Z' || opcion == 'z') {
        procesar_opcion_z();
    } else if (opcion == 'S' || opcion == 's') {
        procesar_opcion_s();
    } else {
        printf("Opcion invalida\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_opcion
 * 'opcion' es un puntero a char (char *), por lo que en scanf se pasa sin '&'.
 * El espacio en " %c" ignora espacios o saltos de línea previos en el buffer.
 */
void leer_opcion(char *opcion) {
    printf("Seleccione una opcion (Z = sucesion, S = sumatoria): ");
    scanf(" %c", opcion);
}

/*
 * PROCEDIMIENTO procesar_opcion_z
 * Aquí 'x' es una variable entera local de este módulo; por ello en scanf se
 * escribe '&x' para entregar su dirección de memoria.
 */
void procesar_opcion_z(void) {
    int x;

    printf("Ingrese un numero entre 0 y 1000: ");
    scanf("%d", &x);

    imprimir_terminos_z();

    if (x < 0 || x > 1000) {
        printf("El numero debe estar en el rango [0, 1000]\n");
    } else if (pertenece_sucesion_z(x)) {
        printf("El numero %d SI pertenece a los 15 primeros terminos de Z\n", x);
    } else {
        printf("El numero %d NO pertenece a los 15 primeros terminos de Z\n", x);
    }
}

/*
 * PROCEDIMIENTO imprimir_terminos_z
 * Genera y muestra los 15 primeros términos Z(0)..Z(14) desplazando tres
 * variables que representan una ventana móvil sobre la sucesión.
 */
void imprimir_terminos_z(void) {
    int z_act = 3, z_sig1 = 2, z_sig2 = 1, z_nuevo;
    int n = 0;

    printf("Terminos Z(0)..Z(14):");
    while (n <= 14) {
        printf(" %d", z_act);
        z_nuevo = z_sig1 + z_sig2 - z_act;
        z_act = z_sig1;
        z_sig1 = z_sig2;
        z_sig2 = z_nuevo;
        n = n + 1;
    }
    printf("\n");
}

/*
 * FUNCIÓN pertenece_sucesion_z
 * Explicación del algoritmo (Variables deslizantes):
 * Como no se utilizan arreglos, se mantienen en memoria únicamente 3 términos
 * consecutivos en cada iteración:
 *
 *      z_act = Z(n),   z_sig1 = Z(n+1),   z_sig2 = Z(n+2)
 *
 * A partir de la relación Z(m) = Z(m-2) + Z(m-1) - Z(m-3), el término Z(n+3) es:
 *
 *      z_nuevo = z_sig1 + z_sig2 - z_act
 *
 * Luego se desplaza la ventana un lugar hacia adelante respetando el orden:
 *      1) z_act  = z_sig1;
 *      2) z_sig1 = z_sig2;
 *      3) z_sig2 = z_nuevo;
 * Si se alterara este orden (por ejemplo, asignando z_sig1 = z_sig2 primero),
 * se sobrescribiría el valor de z_sig1 antes de poder copiarlo en z_act.
 */
int pertenece_sucesion_z(int x) {
    int z_act = 3, z_sig1 = 2, z_sig2 = 1, z_nuevo;
    int n = 0;
    int encontrado = 0;

    while (n <= 14 && !encontrado) {
        if (z_act == x) {
            encontrado = 1;
        }
        z_nuevo = z_sig1 + z_sig2 - z_act;
        z_act = z_sig1;
        z_sig1 = z_sig2;
        z_sig2 = z_nuevo;
        n = n + 1;
    }

    return encontrado;
}

/*
 * PROCEDIMIENTO procesar_opcion_s
 * Lee los parámetros 'a' y 'n' mediante paso por referencia, valida que
 * pertenezcan a los intervalos [0, 2] y [0, 10] respectivamente, e imprime el
 * resultado de la sumatoria con 4 cifras decimales ("%.4lf").
 */
void procesar_opcion_s(void) {
    double a;
    int n;

    leer_datos_s(&a, &n);

    if (a < 0 || a > 2 || n < 0 || n > 10) {
        printf("Datos fuera de rango: a debe estar en [0, 2] y n en [0, 10]\n");
    } else {
        printf("El resultado de la sumatoria es: %.4lf\n", calcular_sumatoria(a, n));
    }
}

/*
 * PROCEDIMIENTO leer_datos_s
 * En scanf, el especificador para el tipo 'double' es siempre "%lf" (long float).
 * Usar "%f" escribiría solo 4 bytes (float) en una variable de 8 bytes (double),
 * dejando el valor corrupto.
 */
void leer_datos_s(double *a, int *n) {
    printf("Ingrese el valor de a (entre 0 y 2): ");
    scanf("%lf", a);
    printf("Ingrese el valor de n (entre 0 y 10): ");
    scanf("%d", n);
}

/*
 * FUNCIÓN calcular_sumatoria
 * Explicación del algoritmo:
 * - El acumulador 'suma' se inicializa en 0 antes del bucle.
 * - Como cada término i se compone de dos sumandos que deben calcularse en un
 *   módulo aparte, se invoca al procedimiento 'calcular_terminos' pasando las
 *   direcciones '&parte1' y '&parte2'. De este modo se obtienen dos valores de
 *   salida simultáneos en cada vuelta del while.
 */
double calcular_sumatoria(double a, int n) {
    double suma = 0;
    double parte1, parte2;
    int i = 0;

    while (i <= n) {
        calcular_terminos(a, i, &parte1, &parte2);
        suma = suma + parte1 + parte2;
        i = i + 1;
    }

    return suma;
}

/*
 * PROCEDIMIENTO calcular_terminos
 * Expresiones clave de C:
 * - Desreferenciación (*parte1 = ..., *parte2 = ...):
 *   El operador '*' delante del puntero accede a la variable original en
 *   'calcular_sumatoria' para escribir allí el resultado.
 * - Función pow(base, exponente) de <math.h>:
 *   Calcula (3 * a)^i en punto flotante. En particular, pow(0.0, 0) evalúa a 1.0.
 * - División real (1.0 / factorial(i)):
 *   Escribir el literal real '1.0' garantiza que la división se realice en
 *   punto flotante y nunca como división entera truncada.
 */
void calcular_terminos(double a, int i, double *parte1, double *parte2) {
    *parte1 = pow(3 * a, i) * factorial(2 * i + 1) / (3 - a);
    *parte2 = 1.0 / factorial(i);
}

/*
 * FUNCIÓN factorial
 * ¿Por qué el factorial retorna 'double' aunque sea un número entero?
 * Porque el tipo 'int' de 32 bits solo soporta hasta 2,147,483,647, y ya a
 * partir de 13! (6,227,020,800) se desborda (overflow). En esta sumatoria,
 * para i = 10 se requiere (2i + 1)! = 21! (~5.109e19), que cabe holgadamente
 * en el rango de un 'double' (~1.7e308).
 */
double factorial(int k) {
    double fact = 1;
    int j = 2;

    while (j <= k) {
        fact = fact * j;
        j = j + 1;
    }

    return fact;
}
