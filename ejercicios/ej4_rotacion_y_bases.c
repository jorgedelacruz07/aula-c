/*
 * =============================================================================
 *  EJERCICIO 4 - ROTACION DE DIGITOS Y SUMA EN BASE b
 *  Patrón: Reconstrucción matemática de números (sin strings ni arreglos)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO (resumido)
 *  Menú:
 *   1) Rotar un número k veces hacia la derecha (D/d) o la izquierda (I/i).
 *        12345 rotado 1 vez a la derecha   -> 51234
 *        12345 rotado 1 vez a la izquierda -> 23451
 *      Condiciones: 0 < número <= 999999999 (máx. 9 cifras), sin ceros, k >= 0.
 *      La rotación sobrescribe la MISMA variable: void rotar_numero(int *num, char sentido)
 *
 *   2) Sumar dos números de máximo 3 cifras escritos en base b (1 < b <= 10)
 *      SIN convertirlos a base 10: cifra por cifra, con acarreo.
 *        (101)_2 + (11)_2 = (1000)_2         (234)_5 + (43)_5 = (332)_5
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* PROCEDIMIENTO: lee la opción del menú. */
void leer_opcion(int *opcion);

/* PROCEDIMIENTO: coordina la opción 1 (rotación). */
void procesar_rotacion(void);

/* PROCEDIMIENTO: lee número, k y sentido por referencia. */
void leer_datos_rotacion(int *num, int *k, char *sentido);

/* FUNCIÓN (retorna int): 1 si los datos de rotación son válidos, 0 si no. */
int validar_rotacion(int num, int k, char sentido);

/* FUNCIÓN (retorna int): 1 si num tiene algún dígito 0, 0 si no. */
int contiene_cero(int num);

/* PROCEDIMIENTO: aplica k rotaciones sobre la misma variable (por referencia). */
void rotar_k_veces(int *num, int k, char sentido);

/* PROCEDIMIENTO: aplica UNA rotación sobrescribiendo *num. */
void rotar_numero(int *num, char sentido);

/* PROCEDIMIENTO: coordina la opción 2 (suma en base b). */
void procesar_suma_en_base(void);

/* PROCEDIMIENTO: lee los 2 números y la base por referencia. */
void leer_datos_base(int *x, int *y, int *base);

/* FUNCIÓN (retorna int): 1 si num tiene máx. 3 cifras y todas son < base. */
int es_valido_en_base(int num, int base);

/* FUNCIÓN (retorna int): x + y en base "base", escrito con dígitos decimales. */
int sumar_en_base(int x, int y, int base);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int opcion;

    leer_opcion(&opcion);

    if (opcion == 1) {
        procesar_rotacion();
    } else if (opcion == 2) {
        procesar_suma_en_base();
    } else {
        printf("Opcion invalida\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

void leer_opcion(int *opcion) {
    printf("1) Rotar un numero\n2) Sumar en base b\nSeleccione una opcion: ");
    scanf("%d", opcion);
}

/* ----------------------------- OPCION 1 ---------------------------------- */

/*
 * PROCEDIMIENTO procesar_rotacion
 * Se imprime 'num' antes de invocar a 'rotar_k_veces(&num, ...)' porque dicho
 * procedimiento modifica directamente la variable 'num' mediante su puntero.
 */
void procesar_rotacion(void) {
    int num, k;
    char sentido;

    leer_datos_rotacion(&num, &k, &sentido);

    if (validar_rotacion(num, k, sentido)) {
        printf("Numero original: %d\n", num);
        rotar_k_veces(&num, k, sentido);
        printf("Numero tras %d rotacion(es) en sentido %c: %d\n", k, sentido, num);
    } else {
        printf("Datos incorrectos\n");
    }
}

void leer_datos_rotacion(int *num, int *k, char *sentido) {
    printf("Ingrese el numero y la cantidad de rotaciones k: ");
    scanf("%d %d", num, k);
    printf("Ingrese el sentido (D = derecha, I = izquierda): ");
    scanf(" %c", sentido);
}

/*
 * FUNCIÓN validar_rotacion
 * - Se restringe 'num <= 999999999' (máximo 9 cifras) porque en un 'int' de
 *   32 bits (máximo 2,147,483,647) rotar un número de 10 cifras como 1999999999
 *   produciría 9199999999, causando desbordamiento (overflow).
 * - Se exige '!contiene_cero(num)' porque si un cero pasa a la primera posición
 *   de la izquierda (ej. 1230 -> 0123 = 123), el número entero pierde una cifra.
 */
int validar_rotacion(int num, int k, char sentido) {
    int sentido_valido;

    sentido_valido = (sentido == 'D' || sentido == 'd' || sentido == 'I' || sentido == 'i');

    return num > 0 && num <= 999999999 && k >= 0 && sentido_valido && !contiene_cero(num);
}

/*
 * FUNCIÓN contiene_cero
 * Recorre las cifras de derecha a izquierda con '% 10' y '/ 10'. Si encuentra
 * un dígito igual a 0, activa la bandera 'hay_cero = 1', lo que detiene el
 * bucle en la siguiente evaluación de la condición.
 */
int contiene_cero(int num) {
    int hay_cero = 0;

    while (num > 0 && !hay_cero) {
        if (num % 10 == 0) {
            hay_cero = 1;
        }
        num = num / 10;
    }

    return hay_cero;
}

/*
 * PROCEDIMIENTO rotar_k_veces
 * 'num' ya es un puntero (int *), por lo que se reenvía a 'rotar_numero(num, ...)'
 * sin el operador '&'. En cada iteración del bucle, '*num' queda actualizado
 * con una rotación adicional.
 */
void rotar_k_veces(int *num, int k, char sentido) {
    int i = 1;

    while (i <= k) {
        rotar_numero(num, sentido);
        i = i + 1;
    }
}

/*
 * PROCEDIMIENTO rotar_numero
 * Explicación matemática y expresiones de C:
 * Sea *num = 12345 (cant_digitos = 5). Entonces potencia = 10^(5-1) = 10000.
 *
 * - Rotación a la DERECHA (el último dígito pasa al inicio):
 *     digito = *num % 10;                  -> 12345 % 10 = 5
 *     *num   = digito * potencia + *num/10 -> 5 * 10000 + 1234 = 51234
 *
 * - Rotación a la IZQUIERDA (el primer dígito pasa al final):
 *     digito = *num / potencia;            -> 12345 / 10000 = 1
 *     *num   = (*num % potencia) * 10 + digito -> 2345 * 10 + 1 = 23451
 *
 * Expresión '(int)(pow(10, cant_digitos - 1) + 0.5)':
 * La función 'pow' opera en punto flotante (double). En algunas implementaciones,
 * pow(10, 4) podría devolver 9999.999999999998, que al truncarse con '(int)'
 * daría 9999 en lugar de 10000. Sumar 0.5 antes del cast asegura el redondeo
 * al entero exacto.
 */
void rotar_numero(int *num, char sentido) {
    int cant_digitos, potencia, digito;

    cant_digitos = (int)log10(*num) + 1;
    potencia = (int)(pow(10, cant_digitos - 1) + 0.5);

    if (sentido == 'D' || sentido == 'd') {
        digito = *num % 10;
        *num = digito * potencia + *num / 10;
    } else {
        digito = *num / potencia;
        *num = (*num % potencia) * 10 + digito;
    }
}

/* ----------------------------- OPCION 2 ---------------------------------- */

/*
 * PROCEDIMIENTO procesar_suma_en_base
 * Por evaluación de cortocircuito en '&&', primero se comprueba que 'base' esté
 * en el rango (1, 10] antes de invocar 'es_valido_en_base'.
 */
void procesar_suma_en_base(void) {
    int x, y, base;

    leer_datos_base(&x, &y, &base);

    if (base > 1 && base <= 10 && es_valido_en_base(x, base) && es_valido_en_base(y, base)) {
        printf("(%d)_%d + (%d)_%d = (%d)_%d\n", x, base, y, base, sumar_en_base(x, y, base), base);
    } else {
        printf("Datos incorrectos\n");
    }
}

void leer_datos_base(int *x, int *y, int *base) {
    printf("Ingrese la base b (1 < b <= 10): ");
    scanf("%d", base);
    printf("Ingrese los dos numeros (maximo 3 cifras cada uno): ");
    scanf("%d %d", x, y);
}

/*
 * FUNCIÓN es_valido_en_base
 * Como el número tiene a lo sumo 3 cifras (0 <= num <= 999), sus tres dígitos
 * posicionales son:
 *   - unidades : num % 10
 *   - decenas  : (num / 10) % 10
 *   - centenas : num / 100
 * En un sistema de numeración de base 'b', todo dígito debe ser estrictamente
 * menor que 'b'.
 */
int es_valido_en_base(int num, int base) {
    int valido = 0;

    if (num >= 0 && num <= 999) {
        valido = (num % 10 < base) && ((num / 10) % 10 < base) && (num / 100 < base);
    }

    return valido;
}

/*
 * FUNCIÓN sumar_en_base
 * Explicación del algoritmo de reconstrucción posicional:
 * Suma columna por columna de derecha a izquierda en base 'base':
 *   1) s = (x % 10) + (y % 10) + acarreo
 *   2) El dígito resultante de esa columna en base 'base' es (s % base).
 *   3) El nuevo acarreo hacia la siguiente columna es (s / base).
 *   4) Se acumula el dígito en su posición decimal multiplicándolo por 'factor'
 *      (que vale 1, 10, 100, 1000, ...).
 *   5) El bucle continúa mientras queden cifras en 'x', en 'y', o un 'acarreo'
 *      pendiente por escribir.
 */
int sumar_en_base(int x, int y, int base) {
    int resultado = 0, factor = 1, acarreo = 0, s;

    while (x > 0 || y > 0 || acarreo > 0) {
        s = x % 10 + y % 10 + acarreo;
        acarreo = s / base;
        resultado = resultado + (s % base) * factor;
        factor = factor * 10;
        x = x / 10;
        y = y / 10;
    }

    return resultado;
}
