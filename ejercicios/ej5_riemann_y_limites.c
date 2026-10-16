/*
 * =============================================================================
 *  EJERCICIO 5 - TRABAJO DE UN RESORTE CON SUMA DE RIEMANN
 *  Patrón: Integración numérica (aproximar un límite) SIN estructuras anidadas
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO (resumido)
 *  Ley de Hooke: F(x) = k * x  (k en N/m, x en m).
 *  El trabajo para estirar el resorte desde x = a hasta x = b es el área bajo
 *  F(x), que se aproxima con una suma de Riemann por la izquierda:
 *
 *                 n-1
 *        W  ~=   SUM  F(x_i) * dx      con  x_i = a + i * dx,   dx = 0.00001
 *                 i=0                       n  = (b - a) / dx  rectángulos
 *
 *  (La integral exacta es el LÍMITE de esa suma cuando dx -> 0:
 *   W = k (b^2 - a^2) / 2. Se usa solo para comprobar el resultado.)
 *
 *  Restricción del laboratorio: PROHIBIDO usar selectivas o iterativas
 *  anidadas (ni if dentro de if, ni while dentro de while).
 *  Módulos exigidos: leer_datos, calcular_f_x_i, calcular_trabajo_i, calcular_trabajo.
 *  Datos válidos: k > 0, 0 <= a < b.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* PROCEDIMIENTO: lee k, a y b por referencia. */
void leer_datos(double *k, double *a, double *b);

/* FUNCIÓN (retorna double): F(x_i) = k * x_i. */
double calcular_f_x_i(double k, double x_i);

/* FUNCIÓN (retorna double): área del rectángulo i = F(x_i) * dx. */
double calcular_trabajo_i(double k, double x_i, double dx);

/* FUNCIÓN (retorna double): suma de Riemann completa (tiene el único while). */
double calcular_trabajo(double k, double a, double b, double dx);

/* PROCEDIMIENTO: imprime aproximado vs exacto y compara con tolerancia. */
void imprimir_resultados(double trabajo, double exacto);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    double k, a, b;
    double dx = 0.00001;
    double trabajo, exacto;

    leer_datos(&k, &a, &b);

    /*
     * Cómo evitar estructuras selectivas anidadas:
     * En lugar de colocar un segundo 'if' dentro de la rama verdadera para
     * comparar 'trabajo' y 'exacto', se delega esa comparación al procedimiento
     * 'imprimir_resultados'. De este modo cada módulo contiene un único nivel
     * de estructura condicional.
     */
    if (k > 0 && a >= 0 && b > a) {
        trabajo = calcular_trabajo(k, a, b, dx);
        exacto = k * (b * b - a * a) / 2;
        imprimir_resultados(trabajo, exacto);
    } else {
        printf("Datos incorrectos: se requiere k > 0 y 0 <= a < b\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_datos
 * 'k', 'a' y 'b' son punteros a double (double *), por lo que se pasan a scanf
 * sin '&' y usando el especificador "%lf".
 */
void leer_datos(double *k, double *a, double *b) {
    printf("Ingrese la constante del resorte k (N/m): ");
    scanf("%lf", k);
    printf("Ingrese la posicion inicial a y la final b (m): ");
    scanf("%lf %lf", a, b);
}

/* FUNCIÓN calcular_f_x_i: evalúa la fuerza del resorte F(x_i) = k * x_i. */
double calcular_f_x_i(double k, double x_i) {
    return k * x_i;
}

/*
 * FUNCIÓN calcular_trabajo_i
 * Calcula el área elemental de un rectángulo de base 'dx' y altura F(x_i),
 * invocando a 'calcular_f_x_i'.
 */
double calcular_trabajo_i(double k, double x_i, double dx) {
    return calcular_f_x_i(k, x_i) * dx;
}

/*
 * FUNCIÓN calcular_trabajo
 * Expresiones clave de C:
 * - Cálculo del número de subintervalos 'n = (int)((b - a) / dx + 0.5)':
 *   Debido a la representación binaria en punto flotante, el cociente
 *   (0.5 - 0.0) / 0.00001 puede evaluarse como 49999.99999999999. Si se
 *   aplicara '(int)' directamente, se truncaría a 49999. Sumar 0.5 antes de
 *   convertir a 'int' garantiza el redondeo al entero correcto (50000).
 * - Cálculo de la abscisa 'x_i = a + i * dx':
 *   Multiplicar el índice entero 'i' por 'dx' evita acumular el error de
 *   redondeo que aparecería al sumar 'x = x + dx' decenas de miles de veces.
 */
double calcular_trabajo(double k, double a, double b, double dx) {
    double trabajo = 0;
    double x_i;
    int n, i = 0;

    n = (int)((b - a) / dx + 0.5);

    while (i < n) {
        x_i = a + i * dx;
        trabajo = trabajo + calcular_trabajo_i(k, x_i, dx);
        i = i + 1;
    }

    return trabajo;
}

/*
 * PROCEDIMIENTO imprimir_resultados
 * Expresión clave de C (comparación de números reales con 'fabs'):
 * Los resultados en punto flotante no se comparan con '==' debido a las
 * diferencias de precisión y de aproximación numérica. Se utiliza 'fabs(x)'
 * de <math.h>, que devuelve el valor absoluto de un 'double' (a diferencia de
 * 'abs(x)', que solo opera con 'int'), verificando que la distancia absoluta
 * '|trabajo - exacto|' sea menor que la tolerancia establecida (0.01 J).
 */
void imprimir_resultados(double trabajo, double exacto) {
    printf("Trabajo aproximado (Riemann): %.4lf J\n", trabajo);
    printf("Trabajo exacto (integral)   : %.4lf J\n", exacto);

    if (fabs(trabajo - exacto) < 0.01) {
        printf("La aproximacion coincide con el valor exacto (tolerancia 0.01 J)\n");
    } else {
        printf("La aproximacion difiere del valor exacto en %.4lf J\n", fabs(trabajo - exacto));
    }
}
