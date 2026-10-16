/*
 * =============================================================================
 *  EJERCICIO I2 - INTERSECCION DE INTERVALOS Y RECTAS EN EL PLANO
 *  Guía PUCP 2.1.5 (Intersección de intervalos) y 2.2.2 (Rectas PQ y RS)
 *  Nivel : Intermedio (Retorno por referencia + reutilización de lectura + fabs)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Parte 1 (Intersección de intervalos cerrados - Guía 2.1.5):
 *    Leer los límites inferior y superior de dos intervalos cerrados [a1, a2]
 *    y [b1, b2]. Validar con una función si cada intervalo es válido
 *    (lim_sup >= lim_inf). Si ambos son válidos, otra función determina si se
 *    intersecan y calcula por referencia los límites del intervalo de
 *    intersección (*inter_inf, *inter_sup).
 *
 *  Parte 2 (Posición relativa de dos rectas - Guía 2.2.2):
 *    Leer 4 puntos P, Q, R, S usando UNA ÚNICA función de lectura:
 *      void leer_punto(char nombre_punto, double *x, double *y)
 *    que recibe el carácter 'P', 'Q', 'R', 'S'.
 *    Calcular las pendientes de las rectas PQ y RS y determinar con funciones
 *    si son paralelas (m1 == m2 con tolerancia fabs), perpendiculares
 *    (m1 * m2 == -1 con tolerancia fabs) o simplemente se cruzan (secantes).
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* --- Módulos de la Parte 1: Intervalos --- */
void leer_intervalo(int numero_intervalo, double *lim_inf, double *lim_sup);
int es_intervalo_valido(double lim_inf, double lim_sup);
double maximo_real(double x, double y);
double minimo_real(double x, double y);
void calcular_interseccion(double a1, double a2, double b1, double b2,
                           int *hay_interseccion, double *inter_inf, double *inter_sup);

/* --- Módulos de la Parte 2: Rectas --- */
void leer_punto(char nombre_punto, double *x, double *y);
int tiene_pendiente_definida(double x1, double x2);
double calcular_pendiente(double x1, double y1, double x2, double y2);
int son_paralelas(double m1, double m2);
int son_perpendiculares(double m1, double m2);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    double a1, a2, b1, b2;
    double inter_inf, inter_sup;
    int hay_interseccion;

    double px, py, qx, qy, rx, ry, sx, sy;
    double m_pq, m_rs;

    /* -------------------- PARTE 1: INTERVALOS -------------------- */
    printf("=== PARTE 1: INTERSECCION DE INTERVALOS CERRADOS ===\n");
    leer_intervalo(1, &a1, &a2);
    leer_intervalo(2, &b1, &b2);

    if (es_intervalo_valido(a1, a2) && es_intervalo_valido(b1, b2)) {
        calcular_interseccion(a1, a2, b1, b2, &hay_interseccion, &inter_inf, &inter_sup);
        if (hay_interseccion) {
            printf("Los intervalos se intersecan en: [%.2lf, %.2lf]\n", inter_inf, inter_sup);
        } else {
            printf("Los intervalos NO se intersecan (conjunto vacio)\n");
        }
    } else {
        printf("Error: al menos uno de los intervalos es invalido (lim_sup < lim_inf)\n");
    }

    /* -------------------- PARTE 2: RECTAS ------------------------ */
    printf("\n=== PARTE 2: POSICION RELATIVA DE LAS RECTAS PQ Y RS ===\n");
    /*
     * Reutilización modular:
     * Se invoca el mismo procedimiento 'leer_punto' 4 veces, variando el
     * carácter identificador ('P', 'Q', 'R', 'S') y los punteros a las
     * coordenadas donde se almacenará cada punto.
     */
    leer_punto('P', &px, &py);
    leer_punto('Q', &qx, &qy);
    leer_punto('R', &rx, &ry);
    leer_punto('S', &sx, &sy);

    if (tiene_pendiente_definida(px, qx) && tiene_pendiente_definida(rx, sx)) {
        m_pq = calcular_pendiente(px, py, qx, qy);
        m_rs = calcular_pendiente(rx, ry, sx, sy);

        printf("Pendiente de PQ (m1): %.4lf\n", m_pq);
        printf("Pendiente de RS (m2): %.4lf\n", m_rs);

        if (son_paralelas(m_pq, m_rs)) {
            printf("Las rectas PQ y RS son PARALELAS\n");
        } else if (son_perpendiculares(m_pq, m_rs)) {
            printf("Las rectas PQ y RS son PERPENDICULARES\n");
        } else {
            printf("Las rectas PQ y RS simplemente SE CRUZAN (secantes oblicuas)\n");
        }
    } else {
        printf("Error: al menos una recta es vertical (x1 == x2), pendiente indefinida\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_intervalo
 */
void leer_intervalo(int numero_intervalo, double *lim_inf, double *lim_sup) {
    printf("Ingrese los limites inferior y superior del intervalo %d: ", numero_intervalo);
    scanf("%lf %lf", lim_inf, lim_sup);
}

/*
 * FUNCIÓN es_intervalo_valido
 * Un intervalo cerrado [lim_inf, lim_sup] es válido en R si su extremo superior
 * es mayor o igual que su extremo inferior.
 */
int es_intervalo_valido(double lim_inf, double lim_sup) {
    int valido = 0;

    if (lim_sup >= lim_inf) {
        valido = 1;
    }

    return valido;
}

/*
 * FUNCIONES maximo_real y minimo_real
 * Funciones auxiliares para obtener el mayor y el menor entre dos números reales.
 */
double maximo_real(double x, double y) {
    double mayor = y;

    if (x > y) {
        mayor = x;
    }

    return mayor;
}

double minimo_real(double x, double y) {
    double menor = y;

    if (x < y) {
        menor = x;
    }

    return menor;
}

/*
 * PROCEDIMIENTO calcular_interseccion
 * Explicación matemática y uso de parámetros por referencia:
 * - La intersección de dos intervalos cerrados [a1, a2] y [b1, b2] está dada por:
 *       [max(a1, b1), min(a2, b2)]
 *   y es no vacía sí y solo si max(a1, b1) <= min(a2, b2).
 * - Esta propiedad evita escribir múltiples condicionales para cada caso de
 *   solapamiento parcial o inclusión total.
 * - Como se requiere devolver 3 valores (el indicador 'hay_interseccion' y los
 *   dos extremos del intervalo resultante), se emplean 3 punteros de salida.
 */
void calcular_interseccion(double a1, double a2, double b1, double b2,
                           int *hay_interseccion, double *inter_inf, double *inter_sup) {
    *inter_inf = maximo_real(a1, b1);
    *inter_sup = minimo_real(a2, b2);

    if (*inter_inf <= *inter_sup) {
        *hay_interseccion = 1;
    } else {
        *hay_interseccion = 0;
    }
}

/*
 * PROCEDIMIENTO leer_punto
 * Combina un parámetro por valor ('nombre_punto', de tipo char, que se imprime
 * con "%c") y dos parámetros por referencia ('x' e 'y', de tipo double *, que
 * reciben las coordenadas leídas con "%lf").
 */
void leer_punto(char nombre_punto, double *x, double *y) {
    printf("Ingrese las coordenadas (x, y) del punto %c: ", nombre_punto);
    scanf("%lf %lf", x, y);
}

/*
 * FUNCIÓN tiene_pendiente_definida
 * Verifica que las abscisas x1 y x2 no coincidan (|x2 - x1| >= 0.0001) para
 * garantizar que el denominador de la pendiente (x2 - x1) no sea cero.
 */
int tiene_pendiente_definida(double x1, double x2) {
    int definida = 0;

    if (fabs(x2 - x1) >= 0.0001) {
        definida = 1;
    }

    return definida;
}

/*
 * FUNCIÓN calcular_pendiente
 */
double calcular_pendiente(double x1, double y1, double x2, double y2) {
    return (y2 - y1) / (x2 - x1);
}

/*
 * FUNCIÓN son_paralelas
 * Expresión clave de C ('fabs(m1 - m2) < 0.0001'):
 * En punto flotante (double), comparar con 'm1 == m2' puede fallar debido a
 * errores de redondeo en los últimos bits de la mantisa (por ejemplo, al
 * dividir 1.0 / 3.0). Por ello se verifica que el valor absoluto de la
 * diferencia entre ambas pendientes sea menor que una tolerancia (0.0001).
 */
int son_paralelas(double m1, double m2) {
    int paralelas = 0;

    if (fabs(m1 - m2) < 0.0001) {
        paralelas = 1;
    }

    return paralelas;
}

/*
 * FUNCIÓN son_perpendiculares
 * Dos rectas con pendientes m1 y m2 son perpendiculares cuando m1 * m2 = -1,
 * lo que equivale a que (m1 * m2) - (-1.0) = m1 * m2 + 1.0 tenga valor absoluto
 * menor que la tolerancia 0.0001.
 */
int son_perpendiculares(double m1, double m2) {
    int perpendiculares = 0;

    if (fabs(m1 * m2 + 1.0) < 0.0001) {
        perpendiculares = 1;
    }

    return perpendiculares;
}
