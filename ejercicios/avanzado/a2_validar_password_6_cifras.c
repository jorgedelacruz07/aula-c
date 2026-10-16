/*
 * =============================================================================
 *  EJERCICIO A2 - VALIDACION DE PASSWORD BANCARIO DE 6 CIFRAS (Guía PUCP 2.3.4)
 *  Nivel : Avanzado (Posición de dígito menor + desempate a la izquierda + 2 punteros)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Validar una contraseña bancaria numérica verificando las 4 reglas:
 *    1) Tiene exactamente 6 cifras.
 *    2) No todas sus cifras son iguales (ej. 444444 es inválido).
 *    3) No contiene ningún dígito cero (ej. 520894 es inválido).
 *    4) El dígito menor NO se encuentra en la primera posición de la izquierda
 *       (posición 1). Si el dígito menor se repite, se considera la posición
 *       más a la izquierda (ej. en 252894 el menor es 2 y aparece en las
 *       posiciones 1 y 3 -> la más a la izquierda es la 1 -> inválido;
 *       en 528924 el menor es 2 en las posiciones 2 y 5 -> la más a la
 *       izquierda es la 2 -> válido).
 *
 *  Prototipos obligatorios de la Guía PUCP:
 *    - void leer_datos(int *password);
 *    - int es_de_seis_cifras(int password);
 *    - int tiene_ceros(int password);
 *    - int todas_cifras_iguales(int password);
 *    - void menor_digito(int password, int *min_digit, int *pos_min_digit);
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* PROCEDIMIENTO: lee la contraseña entera por referencia. */
void leer_datos(int *password);

/* FUNCIÓN: retorna 1 si password tiene exactamente 6 cifras, 0 si no. */
int es_de_seis_cifras(int password);

/* FUNCIÓN: retorna 1 si password contiene al menos un dígito 0, 0 si no tiene ceros. */
int tiene_ceros(int password);

/* FUNCIÓN: retorna 1 si los 6 dígitos de password son idénticos, 0 si no. */
int todas_cifras_iguales(int password);

/* PROCEDIMIENTO: halla el menor dígito y su posición más a la izquierda (1..6). */
void menor_digito(int password, int *min_digit, int *pos_min_digit);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int password;
    int min_digit, pos_min_digit;

    leer_datos(&password);

    if (!es_de_seis_cifras(password)) {
        printf("Password INVALIDO: no tiene exactamente 6 cifras\n");
    } else if (tiene_ceros(password)) {
        printf("Password INVALIDO: no debe contener el digito cero (0)\n");
    } else if (todas_cifras_iguales(password)) {
        printf("Password INVALIDO: no todas las cifras pueden ser iguales\n");
    } else {
        menor_digito(password, &min_digit, &pos_min_digit);
        printf("Menor digito: %d (ubicado en la posicion %d desde la izquierda)\n",
               min_digit, pos_min_digit);

        if (pos_min_digit == 1) {
            printf("Password INVALIDO: el menor digito se ubica en la primera posicion de la izquierda\n");
        } else {
            printf("Password VALIDO: cumple todas las reglas de seguridad\n");
        }
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_datos
 */
void leer_datos(int *password) {
    printf("Ingrese el password numerico de 6 cifras: ");
    scanf("%d", password);
}

/*
 * FUNCIÓN es_de_seis_cifras
 * Comprueba sin estructuras iterativas que 'password' sea positivo y tenga
 * exactamente 6 dígitos mediante '(int)log10(password) + 1 == 6' (equivalente
 * a pertenecer al intervalo [100000, 999999]).
 */
int es_de_seis_cifras(int password) {
    int resultado = 0;

    if (password > 0 && (int)log10(password) + 1 == 6) {
        resultado = 1;
    }

    return resultado;
}

/*
 * FUNCIÓN tiene_ceros
 * Extrae las cifras de derecha a izquierda con '% 10'. Si alguna cifra es 0,
 * activa 'encontro_cero = 1' y la condición '!encontro_cero' finaliza el bucle.
 */
int tiene_ceros(int password) {
    int encontro_cero = 0;
    int digito;

    while (password > 0 && !encontro_cero) {
        digito = password % 10;
        if (digito == 0) {
            encontro_cero = 1;
        }
        password = password / 10;
    }

    return encontro_cero;
}

/*
 * FUNCIÓN todas_cifras_iguales
 * Toma el dígito de las unidades ('referencia = password % 10') y verifica si
 * todos los dígitos restantes son iguales a 'referencia'. En cuanto aparece un
 * dígito distinto, 'iguales' cambia a 0 y termina la búsqueda.
 */
int todas_cifras_iguales(int password) {
    int referencia, digito;
    int iguales = 1;

    referencia = password % 10;
    password = password / 10;

    while (password > 0 && iguales) {
        digito = password % 10;
        if (digito != referencia) {
            iguales = 0;
        }
        password = password / 10;
    }

    return iguales;
}

/*
 * PROCEDIMIENTO menor_digito
 * Explicación del recorrido posicional y del operador '<=' vs '<':
 * - Las posiciones de un número de 6 cifras se numeran de izquierda a derecha:
 *       Posición:   1   2   3   4   5   6
 *       Ejemplo :   5   2   8   9   2   4
 * - Al descomponer el número con '% 10' y '/ 10', las cifras se visitan de
 *   derecha a izquierda, por lo que 'pos_actual' empieza en 6 y disminuye en 1
 *   en cada vuelta hasta llegar a 1.
 * - El enunciado establece que, si el menor dígito se repite, debe considerarse
 *   la posición MÁS A LA IZQUIERDA (el menor índice de posición).
 * - Como el bucle avanza hacia la izquierda, utilizar la condición
 *   'if (digito <= *min_digit)' (con menor o igual) hace que, al encontrar
 *   nuevamente un dígito igual al mínimo actual en una posición más a la
 *   izquierda, '*pos_min_digit' se actualice con esa nueva posición menor.
 *   (Si se usara '<' estricto, conservaría la primera aparición vista, que
 *   sería la de más a la derecha).
 */
void menor_digito(int password, int *min_digit, int *pos_min_digit) {
    int pos_actual, digito;

    *min_digit = 10;
    *pos_min_digit = 6;
    pos_actual = 6;

    while (password > 0) {
        digito = password % 10;
        if (digito <= *min_digit) {
            *min_digit = digito;
            *pos_min_digit = pos_actual;
        }
        password = password / 10;
        pos_actual = pos_actual - 1;
    }
}
