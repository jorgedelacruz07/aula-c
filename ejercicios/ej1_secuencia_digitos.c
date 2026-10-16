/*
 * =============================================================================
 *  EJERCICIO 1 - SECUENCIA ENTRE DIGITOS CONTIGUOS
 *  Patrón: Descomposición de dígitos (% 10 y / 10) + submódulo invocado en bucle
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO (resumido)
 *  Se lee un número entero positivo, su cantidad de dígitos y un operador
 *  (+, -, *, /). Leyendo el número de DERECHA a IZQUIERDA, se debe determinar
 *  si cada dígito se obtiene del anterior aplicando SIEMPRE el mismo operador
 *  con el mismo valor (el "valor de secuencia", que debe ser > 0).
 *
 *    97531  con '+'  ->  1, 3, 5, 7, 9   (se suma 2 cada vez)     -> +2
 *    345678 con '-'  ->  8, 7, 6, 5, 4, 3 (se resta 1 cada vez)   -> -1
 *    842    con '*'  ->  2, 4, 8          (se multiplica por 2)   -> *2
 *    139    con '/'  ->  9, 3, 1          (se divide entre 3)     -> /3
 *
 *  Si el número no es positivo, la cantidad de dígitos no coincide (o es < 3)
 *  o el operador no es válido, se imprime "Datos incorrectos".
 *
 *  Módulos exigidos: leer, validar, secuencia, procesar.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/*
 * Los prototipos se declaran antes de main para que el compilador conozca la
 * firma de cada módulo (nombre, tipo de retorno y tipos de parámetros) antes
 * de que sea invocado. Terminan siempre en punto y coma (;).
 */

/* PROCEDIMIENTO (void): lee 3 datos y los devuelve por referencia (punteros). */
void leer(int *num, int *cant_dig, char *op);

/* FUNCIÓN (retorna int): 1 si los datos son válidos, 0 si no lo son. */
int validar(int num, int cant_dig, char op);

/* FUNCIÓN (retorna int): paso entre 2 dígitos contiguos, o -1 si no existe. */
int secuencia(int dig_der, int dig_izq, char op);

/* PROCEDIMIENTO (void): recorre el número con while e imprime el veredicto. */
void procesar(int num, char op);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int numero, cant_digitos;
    char operador;

    /*
     * Paso por referencia (&):
     * El operador '&' obtiene la dirección de memoria de cada variable local.
     * Se envían las direcciones para que el procedimiento 'leer' pueda escribir
     * directamente en ellas. Si se enviara el valor sin '&', el módulo
     * modificaría únicamente una copia temporal.
     */
    leer(&numero, &cant_digitos, &operador);

    /*
     * En ANSI C89 las condiciones lógicas evalúan enteros:
     *   0 = falso, cualquier valor distinto de 0 (usualmente 1) = verdadero.
     * Como 'validar' retorna 1 o 0, puede usarse directamente en el 'if'.
     */
    if (validar(numero, cant_digitos, operador)) {
        procesar(numero, operador);
    } else {
        printf("Datos incorrectos\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer
 * Expresiones clave de C:
 * - Parámetros puntero (int *num, int *cant_dig, char *op):
 *   Almacenan direcciones de memoria. Como scanf requiere direcciones de
 *   memoria para guardar los datos leídos, se pasa 'num' directamente SIN '&'.
 *   Escribir '&num' pasaría la dirección del puntero (int **), provocando un
 *   error de acceso a memoria.
 * - Formato " %c" con espacio inicial:
 *   Después de leer números con "%d", el salto de línea ('\n') de la tecla Enter
 *   queda pendiente en el buffer de entrada (stdin). El espacio antes de "%c"
 *   le indica a scanf que ignore cualquier espacio en blanco o salto de línea
 *   previo antes de leer el carácter del operador.
 */
void leer(int *num, int *cant_dig, char *op) {
    printf("Ingrese un numero y su cantidad de digitos: ");
    scanf("%d %d", num, cant_dig);
    printf("Ingrese la operacion de la secuencia (+, -, *, /): ");
    scanf(" %c", op);
}

/*
 * FUNCIÓN validar
 * Expresiones clave de C:
 * - Conteo de cifras sin bucle con (int)log10(num) + 1:
 *   El logaritmo en base 10 de un entero positivo de d cifras cumple:
 *   d - 1 <= log10(num) < d. Por ejemplo: log10(97531) = 4.989...
 *   El cast '(int)' trunca la parte decimal dejando 4, y al sumar 1 se obtiene
 *   exactamente 5 cifras.
 * - Validación previa (num > 0):
 *   El logaritmo no está definido para 0 ni para negativos; por ello primero se
 *   comprueba 'num > 0' antes de evaluar 'log10(num)'.
 * - Asignación de expresión lógica (op_valido = ...):
 *   En C, los operadores '==' y '||' producen un valor entero 1 (verdadero) o
 *   0 (falso), que puede guardarse en una variable 'int'.
 */
int validar(int num, int cant_dig, char op) {
    int es_valido = 0;
    int op_valido;

    op_valido = (op == '+' || op == '-' || op == '*' || op == '/');

    if (num > 0 && cant_dig >= 3) {
        es_valido = ((int)log10(num) + 1 == cant_dig) && op_valido;
    }

    return es_valido;
}

/*
 * FUNCIÓN secuencia
 * Recibe el dígito de la derecha, el dígito contiguo a su izquierda y el
 * operador. Retorna el valor del paso entre ambos, o -1 si la operación no es
 * exacta.
 *
 * Lógica del paso (leyendo de derecha a izquierda):
 * - '+': de 1 a 3 se suma 2       -> paso = dig_izq - dig_der = 3 - 1 = 2
 * - '-': de 8 a 7 se resta 1      -> paso = dig_der - dig_izq = 8 - 7 = 1
 * - '*': de 2 a 4 se multiplica   -> paso = dig_izq / dig_der = 4 / 2 = 2
 * - '/': de 9 a 3 se divide       -> paso = dig_der / dig_izq = 9 / 3 = 3
 *
 * Expresión clave de C (evaluación por cortocircuito en '&&'):
 * En 'dig_der != 0 && dig_izq % dig_der == 0', si 'dig_der != 0' es falso,
 * C no evalúa el operando derecho, evitando así una división o módulo entre 0.
 */
int secuencia(int dig_der, int dig_izq, char op) {
    int paso = -1;

    if (op == '+') {
        paso = dig_izq - dig_der;
    } else if (op == '-') {
        paso = dig_der - dig_izq;
    } else if (op == '*' && dig_der != 0 && dig_izq % dig_der == 0) {
        paso = dig_izq / dig_der;
    } else if (op == '/' && dig_izq != 0 && dig_der % dig_izq == 0) {
        paso = dig_der / dig_izq;
    }

    return paso;
}

/*
 * PROCEDIMIENTO procesar
 * Explicación del algoritmo y expresiones de C:
 * - Uso de variable 'copia': se divide sucesivamente entre 10 para extraer sus
 *   dígitos sin perder el valor original de 'num' (necesario en el printf final).
 * - Extracción de dígitos contiguos con '%' (módulo) y '/' (división entera):
 *     copia % 10         -> extrae el último dígito (unidades). Ej: 97531 % 10 = 1
 *     (copia / 10) % 10  -> extrae el penúltimo dígito (decenas). Ej: 9753 % 10 = 3
 *     copia = copia / 10 -> descarta el último dígito. Ej: 97531 / 10 = 9753
 * - Control del bucle con bandera ('cumple'):
 *   El bucle continúa mientras queden al menos 2 dígitos ('copia >= 10') y la
 *   bandera 'cumple' valga 1. Si un par de dígitos rompe la regla, 'cumple'
 *   pasa a 0 y el bucle finaliza limpiamente sin usar 'break'.
 * - Bandera 'primera_vuelta': permite capturar el primer paso calculado como
 *   'paso_ref' para compararlo contra todos los pasos siguientes.
 */
void procesar(int num, char op) {
    int copia, dig_der, dig_izq;
    int paso_actual, paso_ref;
    int cumple, primera_vuelta;

    copia = num;
    paso_ref = 0;
    cumple = 1;
    primera_vuelta = 1;

    while (copia >= 10 && cumple) {
        dig_der = copia % 10;
        dig_izq = (copia / 10) % 10;

        paso_actual = secuencia(dig_der, dig_izq, op);

        if (primera_vuelta) {
            paso_ref = paso_actual;
            primera_vuelta = 0;
        }

        if (paso_actual <= 0 || paso_actual != paso_ref) {
            cumple = 0;
        }

        copia = copia / 10;
    }

    if (cumple) {
        printf("Los digitos del numero %d tienen una secuencia de %c%d\n", num, op, paso_ref);
    } else {
        printf("Los digitos del numero %d no tienen una secuencia de %c\n", num, op);
    }
}
