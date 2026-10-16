/*
 * =============================================================================
 *  EJERCICIO I3 - LABORATORIO 5 CICLO 2025-1: SUCESION B(n), DENSIDAD Y PRESION
 *  Guía PUCP 2.2.9 (Lab 5 2025-1)
 *  Nivel : Intermedio (Menú char mayúscula/minúscula + recurrencia + intervalos)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Implementar un menú con las opciones:
 *    - 'B' o 'b' (Sucesión B(n)):
 *        Validar en un módulo que el número leído esté en el intervalo cerrado
 *        [0, 5500]. En otro módulo iterativo (que NO debe leer ni imprimir),
 *        verificar si dicho número pertenece a los 20 primeros términos
 *        (n = 0 hasta n = 19) de la sucesión definida por:
 *          B(0) = 2
 *          B(1) = 3
 *          B(n) = B(n - 2) + B(n - 1) - (n % 4),  para n >= 2
 *
 *    - 'D' o 'd' (Densidad rho = m / V):
 *        Validar estrictamente los intervalos abiertos y cerrados:
 *          masa m en ]0, 5]     ->  m > 0.0 && m <= 5.0
 *          volumen V en ]0, 3]  ->  V > 0.0 && V <= 3.0
 *        Si son válidos, calcular e imprimir la densidad.
 *
 *    - 'P' o 'p' (Presión p = F / A):
 *        Validar estrictamente los intervalos abiertos y cerrados:
 *          fuerza F en [5, 1000] -> F >= 5.0 && F <= 1000.0
 *          área A en ]0, 5]      -> A > 0.0 && A <= 5.0
 *        Si son válidos, calcular e imprimir la presión.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>

/* PROCEDIMIENTO: muestra el menú y lee la opción como carácter. */
void leer_opcion(char *opcion);

/* FUNCIÓN: valida que el número para la sucesión B esté en [0, 5500]. */
int validar_rango_B(int num);

/* FUNCIÓN: retorna 1 si 'num' pertenece a los 20 primeros términos de B(n), 0 si no. */
int pertenece_sucesion_B(int num);

/* FUNCIÓN: valida masa en ]0, 5] y volumen en ]0, 3]. */
int validar_datos_densidad(double masa, double volumen);

/* FUNCIÓN: calcula la densidad rho = masa / volumen. */
double calcular_densidad(double masa, double volumen);

/* FUNCIÓN: valida fuerza en [5, 1000] y área en ]0, 5]. */
int validar_datos_presion(double fuerza, double area);

/* FUNCIÓN: calcula la presión p = fuerza / area. */
double calcular_presion(double fuerza, double area);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    char opcion;
    int numero;
    double masa, volumen, densidad;
    double fuerza, area, presion;

    leer_opcion(&opcion);

    if (opcion == 'B' || opcion == 'b') {
        printf("Ingrese un numero entero en [0, 5500]: ");
        scanf("%d", &numero);

        if (validar_rango_B(numero)) {
            if (pertenece_sucesion_B(numero)) {
                printf("El numero %d SI pertenece a los 20 primeros terminos de B(n)\n", numero);
            } else {
                printf("El numero %d NO pertenece a los 20 primeros terminos de B(n)\n", numero);
            }
        } else {
            printf("Error: el numero debe pertenecer al intervalo [0, 5500]\n");
        }
    } else if (opcion == 'D' || opcion == 'd') {
        printf("Ingrese la masa (en ]0, 5]) y el volumen (en ]0, 3]): ");
        scanf("%lf %lf", &masa, &volumen);

        if (validar_datos_densidad(masa, volumen)) {
            densidad = calcular_densidad(masa, volumen);
            printf("La densidad es: %.4lf kg/m^3\n", densidad);
        } else {
            printf("Error: masa debe estar en ]0, 5] y volumen en ]0, 3]\n");
        }
    } else if (opcion == 'P' || opcion == 'p') {
        printf("Ingrese la fuerza (en [5, 1000]) y el area (en ]0, 5]): ");
        scanf("%lf %lf", &fuerza, &area);

        if (validar_datos_presion(fuerza, area)) {
            presion = calcular_presion(fuerza, area);
            printf("La presion es: %.4lf Pa\n", presion);
        } else {
            printf("Error: fuerza debe estar en [5, 1000] y area en ]0, 5]\n");
        }
    } else {
        printf("Opcion no valida\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_opcion
 * El espacio antes de "%c" en scanf(" %c", opcion) descarta cualquier espacio
 * en blanco o salto de línea previo en el flujo de entrada.
 */
void leer_opcion(char *opcion) {
    printf("================ MENU LAB 5 (2025-1) ================\n");
    printf("  [B/b] Verificar pertenencia a la sucesion B(n)\n");
    printf("  [D/d] Calcular Densidad (rho = m / V)\n");
    printf("  [P/p] Calcular Presion  (p = F / A)\n");
    printf("Ingrese su opcion: ");
    scanf(" %c", opcion);
}

/*
 * FUNCIÓN validar_rango_B
 * Intervalo cerrado [0, 5500]: ambos extremos están incluidos ('>=' y '<=').
 */
int validar_rango_B(int num) {
    int valido = 0;

    if (num >= 0 && num <= 5500) {
        valido = 1;
    }

    return valido;
}

/*
 * FUNCIÓN pertenece_sucesion_B
 * Explicación del algoritmo de recurrencia:
 * - Este módulo es una función pura: no utiliza scanf ni printf; únicamente
 *   calcula y retorna 1 si 'num' pertenece a los 20 primeros términos, o 0 si no.
 * - Como el primer índice es n = 0, los 20 primeros términos abarcan desde
 *   n = 0 hasta n = 19 (por ello la condición del bucle es 'n < 20').
 * - Se emplean dos variables deslizantes inicializadas en los casos base:
 *       b_ant2 = B(0) = 2
 *       b_ant1 = B(1) = 3
 * - En cada iteración (para n >= 2) se calcula:
 *       b_actual = b_ant2 + b_ant1 - (n % 4);
 *   donde 'n % 4' produce cíclicamente los restos 0, 1, 2, 3.
 * - Antes de pasar al siguiente 'n', se actualizan los términos anteriores:
 *       b_ant2 = b_ant1;
 *       b_ant1 = b_actual;
 * - Los 20 términos generados (n = 0..19) son:
 *   2, 3, 3, 3, 6, 8, 12, 17, 29, 45, 72, 114, 186, 299, 483, 779, 1262,
 *   2040, 3300, 5337.
 */
int pertenece_sucesion_B(int num) {
    int b_ant2, b_ant1, b_actual;
    int n, pertenece;

    b_ant2 = 2;
    b_ant1 = 3;
    pertenece = 0;

    if (num == b_ant2 || num == b_ant1) {
        pertenece = 1;
    }

    n = 2;
    while (n < 20 && !pertenece) {
        b_actual = b_ant2 + b_ant1 - (n % 4);
        if (b_actual == num) {
            pertenece = 1;
        }
        b_ant2 = b_ant1;
        b_ant1 = b_actual;
        n = n + 1;
    }

    return pertenece;
}

/*
 * FUNCIÓN validar_datos_densidad
 * Traducción de intervalos matemáticos a operadores relacionales de C:
 * - Intervalo semiabierto ]0, 5]: abierto en 0 ('masa > 0.0') y cerrado en 5
 *   ('masa <= 5.0').
 * - Intervalo semiabierto ]0, 3]: abierto en 0 ('volumen > 0.0', lo que además
 *   impide dividir entre cero) y cerrado en 3 ('volumen <= 3.0').
 */
int validar_datos_densidad(double masa, double volumen) {
    int valido = 0;

    if (masa > 0.0 && masa <= 5.0 && volumen > 0.0 && volumen <= 3.0) {
        valido = 1;
    }

    return valido;
}

double calcular_densidad(double masa, double volumen) {
    return masa / volumen;
}

/*
 * FUNCIÓN validar_datos_presion
 * - Fuerza en [5, 1000] (cerrado en ambos extremos): 'fuerza >= 5.0 && fuerza <= 1000.0'
 * - Área en ]0, 5] (abierto en 0, cerrado en 5):     'area > 0.0 && area <= 5.0'
 */
int validar_datos_presion(double fuerza, double area) {
    int valido = 0;

    if (fuerza >= 5.0 && fuerza <= 1000.0 && area > 0.0 && area <= 5.0) {
        valido = 1;
    }

    return valido;
}

double calcular_presion(double fuerza, double area) {
    return fuerza / area;
}
