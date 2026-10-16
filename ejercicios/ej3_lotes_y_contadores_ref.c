/*
 * =============================================================================
 *  EJERCICIO 3 - LOTE DE MEDICIONES DE ILUMINANCIA
 *  Patrón: Lote de N datos + múltiples contadores pasados por referencia
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO (resumido)
 *  Se lee una cantidad N > 0 de mediciones. Para cada medición se elige:
 *    I/i) Iluminancia directa: se ingresa un valor y su unidad
 *         (L = lux, H = hectolux; 1 hectolux = 100 lux).
 *    F/f) Flujo y área: iluminancia (lux) = flujo (lm) / área (m2), área > 0.
 *
 *  Cada medición válida se clasifica según el nivel de luz diurna:
 *     lux >= 32000            -> Luz solar directa BRILLANTE
 *     10000 <= lux < 32000    -> Luz diurna de CIELO AZUL
 *     1000  <= lux < 10000    -> Dia NUBLADO
 *     0     <= lux < 1000     -> OCASO (amanecer / atardecer)
 *  Las mediciones inválidas (opción, unidad o área incorrecta) no se cuentan.
 *  Al final se imprime un reporte con la cantidad y el porcentaje de cada nivel.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>

/* PROCEDIMIENTO: lee N por referencia. */
void leer_cantidad(int *n);

/* PROCEDIMIENTO: while que recorre el lote y actualiza 4 contadores por referencia. */
void procesar_mediciones(int n, int *cant_brillante, int *cant_cielo_azul,
                         int *cant_nublado, int *cant_ocaso);

/* PROCEDIMIENTO: lee los datos de UNA medición (4 resultados por referencia). */
void leer_medicion(int num_medicion, char *tipo, double *valor1, double *valor2, char *unidad);

/* FUNCIÓN (retorna double): iluminancia en lux, o -1 si la medición es inválida. */
double calcular_iluminancia(char tipo, double valor1, double valor2, char unidad);

/* PROCEDIMIENTO: imprime el nivel y suma 1 al contador que corresponda. */
void clasificar_iluminancia(double lux, int *cant_brillante, int *cant_cielo_azul,
                            int *cant_nublado, int *cant_ocaso);

/* PROCEDIMIENTO: imprime el reporte final (solo recibe valores, no modifica nada). */
void imprimir_reporte(int n, int cant_brillante, int cant_cielo_azul,
                      int cant_nublado, int cant_ocaso);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int n;

    /*
     * Inicialización obligatoria de contadores:
     * En C, las variables locales no se inicializan en 0 automáticamente;
     * contienen valores residuales de memoria ("basura") hasta que se les
     * asigna un valor inicial explícito.
     */
    int cant_brillante = 0, cant_cielo_azul = 0, cant_nublado = 0, cant_ocaso = 0;

    leer_cantidad(&n);

    if (n <= 0) {
        printf("La cantidad de mediciones debe ser mayor que 0\n");
    } else {
        /*
         * Se pasan las direcciones (&) de los 4 contadores a 'procesar_mediciones'
         * para que los incremente a medida que procesa el lote.
         * En cambio, 'imprimir_reporte' solo necesita consultar sus valores
         * finales, por lo que los recibe por valor (sin '&').
         */
        procesar_mediciones(n, &cant_brillante, &cant_cielo_azul, &cant_nublado, &cant_ocaso);
        imprimir_reporte(n, cant_brillante, cant_cielo_azul, cant_nublado, cant_ocaso);
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/* PROCEDIMIENTO leer_cantidad: 'n' ya es puntero -> scanf("%d", n) sin '&'. */
void leer_cantidad(int *n) {
    printf("Ingrese la cantidad de mediciones: ");
    scanf("%d", n);
}

/*
 * PROCEDIMIENTO procesar_mediciones
 * Expresión clave de C (reenvío de punteros entre módulos):
 * - Los parámetros 'cant_brillante', 'cant_cielo_azul', etc. ya son de tipo
 *   puntero (int *), es decir, ya contienen las direcciones de las variables
 *   de 'main'.
 * - Por ello, al invocar 'clasificar_iluminancia', se pasan directamente SIN '&'
 *   para reenviar esas mismas direcciones de memoria.
 * - En cambio, 'tipo', 'valor1', 'valor2' y 'unidad' son variables locales de
 *   este procedimiento, por lo que a 'leer_medicion' sí se les antepone '&'.
 */
void procesar_mediciones(int n, int *cant_brillante, int *cant_cielo_azul,
                         int *cant_nublado, int *cant_ocaso) {
    int i = 1;
    char tipo, unidad;
    double valor1, valor2, lux;

    while (i <= n) {
        leer_medicion(i, &tipo, &valor1, &valor2, &unidad);
        lux = calcular_iluminancia(tipo, valor1, valor2, unidad);
        clasificar_iluminancia(lux, cant_brillante, cant_cielo_azul, cant_nublado, cant_ocaso);
        i = i + 1;
    }
}

/*
 * PROCEDIMIENTO leer_medicion
 * - Se inicializan '*valor1', '*valor2' y '*unidad' con valores neutros por si
 *   el usuario ingresa un 'tipo' inválido.
 * - Para consultar el carácter recién leído a través del puntero 'tipo', se
 *   desreferencia con '*tipo'.
 */
void leer_medicion(int num_medicion, char *tipo, double *valor1, double *valor2, char *unidad) {
    *valor1 = 0;
    *valor2 = 0;
    *unidad = ' ';

    printf("Medicion %d - Tipo (I = iluminancia directa, F = flujo/area): ", num_medicion);
    scanf(" %c", tipo);

    if (*tipo == 'I' || *tipo == 'i') {
        printf("  Ingrese el valor y la unidad (L = lux, H = hectolux): ");
        scanf("%lf %c", valor1, unidad);
    } else if (*tipo == 'F' || *tipo == 'f') {
        printf("  Ingrese el flujo luminoso (lm) y el area (m2): ");
        scanf("%lf %lf", valor1, valor2);
    }
}

/*
 * FUNCIÓN calcular_iluminancia
 * Convierte la medición a lux según el tipo y unidad, o devuelve -1.0 como
 * valor centinela si los datos son inválidos (dado que la iluminancia física
 * nunca puede ser negativa).
 */
double calcular_iluminancia(char tipo, double valor1, double valor2, char unidad) {
    double lux = -1;
    int es_directa, es_flujo;

    es_directa = (tipo == 'I' || tipo == 'i');
    es_flujo = (tipo == 'F' || tipo == 'f');

    if (es_directa && (unidad == 'L' || unidad == 'l') && valor1 >= 0) {
        lux = valor1;
    } else if (es_directa && (unidad == 'H' || unidad == 'h') && valor1 >= 0) {
        lux = valor1 * 100;
    } else if (es_flujo && valor1 >= 0 && valor2 > 0) {
        lux = valor1 / valor2;
    }

    return lux;
}

/*
 * PROCEDIMIENTO clasificar_iluminancia
 * Expresión clave de C (incremento de un valor apuntado por un puntero):
 * - Para sumar 1 al contador apuntado se escribe:
 *       *cant_ocaso = *cant_ocaso + 1;
 * - NO debe escribirse '*cant_ocaso++;' sin paréntesis, porque en C el operador
 *   postfijo '++' tiene mayor precedencia que el operador de desreferencia '*'.
 *   La expresión '*cant_ocaso++' equivale a '*(cant_ocaso++)', lo cual avanza
 *   la dirección del puntero en vez de incrementar el número entero apuntado.
 */
void clasificar_iluminancia(double lux, int *cant_brillante, int *cant_cielo_azul,
                            int *cant_nublado, int *cant_ocaso) {
    if (lux < 0) {
        printf("  -> Medicion invalida: no se clasifica\n");
    } else if (lux >= 32000) {
        printf("  -> %.2lf lux: Luz solar directa BRILLANTE\n", lux);
        *cant_brillante = *cant_brillante + 1;
    } else if (lux >= 10000) {
        printf("  -> %.2lf lux: Luz diurna de CIELO AZUL\n", lux);
        *cant_cielo_azul = *cant_cielo_azul + 1;
    } else if (lux >= 1000) {
        printf("  -> %.2lf lux: Dia NUBLADO\n", lux);
        *cant_nublado = *cant_nublado + 1;
    } else {
        printf("  -> %.2lf lux: OCASO\n", lux);
        *cant_ocaso = *cant_ocaso + 1;
    }
}

/*
 * PROCEDIMIENTO imprimir_reporte
 * Expresiones clave de C:
 * - Conversión explícita '(double)cant_brillante / n * 100':
 *   Como 'cant_brillante' y 'n' son de tipo 'int', la expresión 'cant_brillante / n'
 *   sin cast realizaría una división entera (por ejemplo, 1 / 4 = 0). El cast
 *   '(double)' convierte el numerador a real antes de dividir.
 * - Secuencia '%%' en printf:
 *   Dado que '%' introduce un especificador de formato en printf, para imprimir
 *   el carácter literal de porcentaje se escribe doble: '%%'.
 */
void imprimir_reporte(int n, int cant_brillante, int cant_cielo_azul,
                      int cant_nublado, int cant_ocaso) {
    int cant_invalidas;

    cant_invalidas = n - (cant_brillante + cant_cielo_azul + cant_nublado + cant_ocaso);

    printf("\n========== REPORTE FINAL ==========\n");
    printf("Total de mediciones     : %d\n", n);
    printf("Brillante (sol directo) : %d (%.2lf%%)\n", cant_brillante, (double)cant_brillante / n * 100);
    printf("Cielo azul              : %d (%.2lf%%)\n", cant_cielo_azul, (double)cant_cielo_azul / n * 100);
    printf("Nublado                 : %d (%.2lf%%)\n", cant_nublado, (double)cant_nublado / n * 100);
    printf("Ocaso                   : %d (%.2lf%%)\n", cant_ocaso, (double)cant_ocaso / n * 100);
    printf("Mediciones invalidas    : %d\n", cant_invalidas);
}
