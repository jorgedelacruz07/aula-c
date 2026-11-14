/* Un plano de asientos.
 * Los ciclos anidados recorren el producto de dos dimensiones; reiniciar la columna es parte del
 * contrato de cada fila.
 */
#include <stdio.h>

int main(void) {
    int filas, columnas;
    if (scanf("%d%d", &filas, &columnas) != 2 || filas < 0 || filas > 8 || columnas < 0 ||
        columnas > 8) {
        puts("Entrada invalida");
        return 1;
    }
    for (int f = 0; f < filas; f++) {
        /* Cada fila comienza otra vez en la columna 0. */
        for (int c = 0; c < columnas; c++) {
            putchar('*');
        }
        putchar('\n');
    }
    return 0;
}
