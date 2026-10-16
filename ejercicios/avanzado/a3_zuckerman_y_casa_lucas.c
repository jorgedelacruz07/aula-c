/*
 * =============================================================================
 *  EJERCICIO A3 - LABORATORIOS 5 CICLO 2023-2: ZUCKERMAN, T(n), CASA Y LUCAS
 *  Guía PUCP 2.3.9 (Zuckerman y T(n)) y 2.3.10 (Número Casa y Número de Lucas)
 *  Nivel : Avanzado (Simulacro de Laboratorio 5 - Ciclo 2023-2)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Selector de dos laboratorios oficiales del ciclo 2023-2:
 *
 *  Modo 1 (Guía 2.3.9 - Número de Zuckerman y Recurrencia T(n)):
 *    - Leer un entero positivo (validando que tenga entre 2 y 5 cifras SIN usar
 *      estructura iterativa).
 *    - Determinar si es un Número de Zuckerman: aquel que es divisible
 *      exactamente por el producto de sus dígitos (por ejemplo: 115 ->
 *      1 * 1 * 5 = 5, y 115 % 5 == 0 -> SÍ es de Zuckerman; 24 -> 2 * 4 = 8,
 *      y 24 % 8 == 0 -> SÍ es de Zuckerman).
 *    - Además, leer A (> 0) y n (>= 0) y calcular iterativamente el término n
 *      de la recurrencia:
 *         T(0) = 2
 *         T(n) = A^2 * T(n - 1),  para n >= 1
 *
 *  Modo 2 (Guía 2.3.10 - Número Casa y Número de Lucas):
 *    - Leer la posición n (entero >= 1).
 *    - Calcular el Número Casa en la posición n mediante DOS módulos distintos
 *      y comprobar que coinciden:
 *        a) Con sumatoria (while):  Casa(n) = (n + 1)^3 + Sum_{k=1..n} (k^2)
 *        b) Con fórmula directa  :  Casa(n) = (8n^3 + 21n^2 + 19n + 6) / 6
 *    - Calcular además el n-ésimo Número de Lucas definido por:
 *        L(0) = 2,  L(1) = 1,  L(n) = L(n - 1) + L(n - 2)
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* --- Módulos del Modo 1 (Guía 2.3.9) --- */
int validar_cifras_sin_bucle(int num);
int producto_digitos(int num);
int es_numero_zuckerman(int num);
double calcular_recurrencia_T(double a, int n);

/* --- Módulos del Modo 2 (Guía 2.3.10) --- */
int numero_casa_sumatoria(int n);
int numero_casa_formula(int n);
int numero_lucas(int n);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int modo;
    int num_zuck, n_rec;
    double base_a, term_t;
    int n_pos, casa_sum, casa_form, lucas_n;

    printf("================ SIMULACRO LAB 5 (2023-2) ================\n");
    printf("  [1] Modo 1: Numero de Zuckerman y Recurrencia T(n)\n");
    printf("  [2] Modo 2: Numero Casa (Sumatoria vs Formula) y Numero de Lucas\n");
    printf("Seleccione el modo (1 o 2): ");
    scanf("%d", &modo);

    if (modo == 1) {
        printf("Ingrese un numero entero positivo (de 2 a 5 cifras): ");
        scanf("%d", &num_zuck);

        if (validar_cifras_sin_bucle(num_zuck)) {
            if (es_numero_zuckerman(num_zuck)) {
                printf("El numero %d SI es un numero de Zuckerman (producto de digitos = %d)\n",
                       num_zuck, producto_digitos(num_zuck));
            } else {
                printf("El numero %d NO es un numero de Zuckerman (producto de digitos = %d)\n",
                       num_zuck, producto_digitos(num_zuck));
            }
        } else {
            printf("Error: el numero debe tener entre 2 y 5 cifras\n");
        }

        printf("Ingrese el valor de A (> 0) y el indice n (>= 0) para T(n): ");
        scanf("%lf %d", &base_a, &n_rec);

        if (base_a > 0.0 && n_rec >= 0) {
            term_t = calcular_recurrencia_T(base_a, n_rec);
            printf("El termino T(%d) con A = %.2lf es: %.2lf\n", n_rec, base_a, term_t);
        } else {
            printf("Error en T(n): se requiere A > 0 y n >= 0\n");
        }
    } else if (modo == 2) {
        printf("Ingrese la posicion n (n >= 1): ");
        scanf("%d", &n_pos);

        if (n_pos >= 1) {
            casa_sum = numero_casa_sumatoria(n_pos);
            casa_form = numero_casa_formula(n_pos);
            lucas_n = numero_lucas(n_pos);

            printf("Numero Casa(%d) por sumatoria : %d\n", n_pos, casa_sum);
            printf("Numero Casa(%d) por formula   : %d\n", n_pos, casa_form);

            if (casa_sum == casa_form) {
                printf("Verificacion: Ambos metodos coinciden exactamente (%d)\n", casa_sum);
            } else {
                printf("Verificacion: Los metodos difieren\n");
            }

            printf("Numero de Lucas L(%d)         : %d\n", n_pos, lucas_n);
        } else {
            printf("Error: la posicion n debe ser mayor o igual a 1\n");
        }
    } else {
        printf("Modo invalido\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * FUNCIÓN validar_cifras_sin_bucle
 * Determina la cantidad de dígitos mediante '(int)log10(num) + 1' sin usar
 * estructuras repetitivas, verificando que esté entre 2 y 5 cifras.
 */
int validar_cifras_sin_bucle(int num) {
    int valido = 0;
    int cifras;

    if (num > 0) {
        cifras = (int)log10(num) + 1;
        if (cifras >= 2 && cifras <= 5) {
            valido = 1;
        }
    }

    return valido;
}

/*
 * FUNCIÓN producto_digitos
 * Inicializa el acumulador multiplicativo 'prod = 1' y multiplica cada dígito
 * extraído con 'num % 10'. Si el número contiene algún dígito 0, el producto
 * resultante es 0.
 */
int producto_digitos(int num) {
    int prod = 1;
    int digito;

    while (num > 0) {
        digito = num % 10;
        prod = prod * digito;
        num = num / 10;
    }

    return prod;
}

/*
 * FUNCIÓN es_numero_zuckerman
 * Expresión 'prod > 0 && num % prod == 0':
 * Si el número contiene un dígito 0 (por ejemplo, 105), 'prod' vale 0. Gracias
 * a la evaluación por cortocircuito del operador '&&', al ser falso 'prod > 0',
 * C no evalúa 'num % prod', evitando una excepción por división entera entre 0.
 */
int es_numero_zuckerman(int num) {
    int prod;
    int es_zuckerman = 0;

    prod = producto_digitos(num);

    if (prod > 0 && num % prod == 0) {
        es_zuckerman = 1;
    }

    return es_zuckerman;
}

/*
 * FUNCIÓN calcular_recurrencia_T
 * Evalúa iterativamente T(0) = 2, T(k) = A^2 * T(k - 1).
 * 'termino' inicia en 2.0 (el caso base T(0)) y en cada una de las 'n' vueltas
 * se multiplica por '(a * a)'. Si n = 0, el bucle no se ejecuta y retorna 2.0.
 */
double calcular_recurrencia_T(double a, int n) {
    double termino = 2.0;
    int k = 1;

    while (k <= n) {
        termino = (a * a) * termino;
        k = k + 1;
    }

    return termino;
}

/*
 * FUNCIÓN numero_casa_sumatoria
 * Calcula geométricamente el Número Casa sumando el cubo inferior (n + 1)^3 y
 * la pirámide superior formada por la suma de los cuadrados desde 1^2 hasta n^2.
 */
int numero_casa_sumatoria(int n) {
    int cubo_base, suma_techo, k;

    cubo_base = (n + 1) * (n + 1) * (n + 1);
    suma_techo = 0;
    k = 1;

    while (k <= n) {
        suma_techo = suma_techo + (k * k);
        k = k + 1;
    }

    return cubo_base + suma_techo;
}

/*
 * FUNCIÓN numero_casa_formula
 * Evalúa la forma algebraica cerrada equivalente:
 *   (n + 1)^3 + n(n + 1)(2n + 1)/6 = (8n^3 + 21n^2 + 19n + 6) / 6.
 * Como el numerador es siempre múltiplo de 6 para cualquier entero n, la
 * división entera '/ 6' es exacta.
 */
int numero_casa_formula(int n) {
    int numerador;

    numerador = 8 * n * n * n + 21 * n * n + 19 * n + 6;

    return numerador / 6;
}

/*
 * FUNCIÓN numero_lucas
 * Genera el término n-ésimo de la sucesión de Lucas:
 *   L(0) = 2, L(1) = 1, y L(k) = L(k - 1) + L(k - 2) para k >= 2,
 * desplazando dos variables ('l_ant2' y 'l_ant1') en cada iteración.
 */
int numero_lucas(int n) {
    int l_ant2, l_ant1, l_actual, k;

    if (n == 0) {
        l_actual = 2;
    } else if (n == 1) {
        l_actual = 1;
    } else {
        l_ant2 = 2;
        l_ant1 = 1;
        l_actual = 3;
        k = 2;

        while (k <= n) {
            l_actual = l_ant1 + l_ant2;
            l_ant2 = l_ant1;
            l_ant1 = l_actual;
            k = k + 1;
        }
    }

    return l_actual;
}
