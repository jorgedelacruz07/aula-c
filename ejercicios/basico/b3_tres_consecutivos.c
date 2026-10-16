/*
 * =============================================================================
 *  EJERCICIO B3 - TRES NUMEROS CONSECUTIVOS SIN ARREGLOS (Guía PUCP 2.1.7)
 *  Nivel : Básico (Ventana deslizante con punteros + reinicio de tríada)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Solicitar una lista de 20 números enteros positivos en un bucle while.
 *  Cada vez que el programa detecte 3 números consecutivos crecientes
 *  (por ejemplo: 6, 7, 8), debe imprimir:
 *    "¡Felicitaciones, ha ingresado 3 numeros consecutivos!"
 *  y al final mostrar cuántas veces se imprimió dicho mensaje.
 *
 *  REGLA CLAVE DEL PROBLEMA:
 *  No se pueden reutilizar números de una tríada ya contada para formar otra:
 *    - Si se ingresa 3, 4, 5, 6, 7, 1 -> solo cuenta (3, 4, 5) e ignora
 *      (4, 5, 6) y (5, 6, 7), reportando 1 vez.
 *    - Si se ingresa 3, 4, 5, 6, 7, 8 -> cuenta (3, 4, 5) y luego (6, 7, 8),
 *      reportando 2 veces.
 *
 *  Módulos requeridos:
 *    - Leer 1 número.
 *    - Recordar/desplazar los 3 últimos números leídos usando paso por
 *      referencia (int *n1, int *n2, int *n3).
 *    - Verificar si 3 números son consecutivos.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>

/* PROCEDIMIENTO: lee un número entero en la posición i de la lista. */
void leer_numero(int indice, int *nuevo);

/* PROCEDIMIENTO: desplaza la ventana de los 3 últimos números (*n1 <- *n2 <- *n3 <- nuevo). */
void desplazar_ultimos_tres(int *n1, int *n2, int *n3, int nuevo);

/* FUNCIÓN: retorna 1 si n1, n2, n3 son positivos y consecutivos (n2 = n1+1, n3 = n2+1). */
int son_tres_consecutivos(int n1, int n2, int n3);

/* PROCEDIMIENTO: procesa la lista de 20 números e imprime el conteo final. */
void procesar_lista_veinte(void);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    procesar_lista_veinte();
    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_numero
 * Recibe por valor el número de orden 'indice' (solo para mostrarlo en el
 * mensaje) y por referencia el puntero 'nuevo' donde scanf almacena el entero.
 */
void leer_numero(int indice, int *nuevo) {
    printf("Ingrese el numero positivo #%d: ", indice);
    scanf("%d", nuevo);
}

/*
 * PROCEDIMIENTO desplazar_ultimos_tres
 * Explicación del desplazamiento con punteros:
 * Como no se emplean arreglos, la historia de los 3 últimos valores leídos se
 * conserva en 3 variables (*n1 es el más antiguo, *n2 el penúltimo y *n3 el más
 * reciente). Al llegar un dato 'nuevo', se desplazan de derecha a izquierda:
 *     1) *n1 = *n2;   (el penúltimo pasa a ser el más antiguo)
 *     2) *n2 = *n3;   (el último pasa a ser el penúltimo)
 *     3) *n3 = nuevo; (el recién leído ocupa el lugar más reciente)
 * El orden de estas tres asignaciones es estricto: si se ejecutara primero
 * '*n3 = nuevo', se perdería el valor anterior de '*n3' antes de copiarlo a '*n2'.
 */
void desplazar_ultimos_tres(int *n1, int *n2, int *n3, int nuevo) {
    *n1 = *n2;
    *n2 = *n3;
    *n3 = nuevo;
}

/*
 * FUNCIÓN son_tres_consecutivos
 * Verifica primero que las tres casillas de la ventana contengan enteros
 * positivos válidos (n1 > 0, n2 > 0, n3 > 0) y luego que cada uno supere en
 * exactamente 1 unidad al anterior ('n2 == n1 + 1 && n3 == n2 + 1').
 * Nota: en C no se puede escribir 'n1 < n2 < n3'; cada comparación debe unirse
 * mediante el operador lógico '&&'.
 */
int son_tres_consecutivos(int n1, int n2, int n3) {
    int resultado = 0;

    if (n1 > 0 && n2 > 0 && n3 > 0) {
        if (n2 == n1 + 1 && n3 == n2 + 1) {
            resultado = 1;
        }
    }

    return resultado;
}

/*
 * PROCEDIMIENTO procesar_lista_veinte
 * Explicación del mecanismo para no reutilizar números de una tríada ya contada:
 * - Las variables 'n1', 'n2' y 'n3' se inicializan en 0. Dado que los datos
 *   válidos son positivos (> 0), el valor 0 representa una "casilla vacía".
 * - Cuando se detecta una tríada consecutiva (por ejemplo, n1=3, n2=4, n3=5),
 *   se imprime la felicitación, se incrementa 'veces_consecutivos' y se
 *   reinician 'n1 = 0', 'n2 = 0', 'n3 = 0'.
 * - Al quedar la ventana en (0, 0, 0), el programa requerirá obligatoriamente
 *   leer otros 3 números nuevos antes de que 'son_tres_consecutivos' pueda
 *   volver a evaluar 1.
 */
void procesar_lista_veinte(void) {
    int i, nuevo;
    int n1, n2, n3;
    int veces_consecutivos;

    n1 = 0;
    n2 = 0;
    n3 = 0;
    veces_consecutivos = 0;
    i = 1;

    while (i <= 20) {
        leer_numero(i, &nuevo);
        desplazar_ultimos_tres(&n1, &n2, &n3, nuevo);

        if (son_tres_consecutivos(n1, n2, n3)) {
            printf("¡Felicitaciones, ha ingresado 3 numeros consecutivos!\n");
            veces_consecutivos = veces_consecutivos + 1;
            n1 = 0;
            n2 = 0;
            n3 = 0;
        }

        i = i + 1;
    }

    printf("Total de veces que ingreso 3 numeros consecutivos: %d\n", veces_consecutivos);
}
