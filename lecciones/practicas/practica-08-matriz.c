/* Consumo por aula y turno.
 * Cada dimensión tiene su propio índice y límite; el acumulador por fila debe reiniciarse al
 * cambiar de aula.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}

int main(void) {
    int filas, columnas, matriz[4][4];
    if (scanf("%d%d", &filas, &columnas) != 2 || filas < 1 || filas > 4 || columnas < 1 ||
        columnas > 4) {
        return invalido();
    }
    for (int f = 0; f < filas; f++) {
        for (int c = 0; c < columnas; c++) {
            if (scanf("%d", &matriz[f][c]) != 1 || matriz[f][c] < 0 || matriz[f][c] > 1000) {
                return invalido();
            }
        }
    }
    for (int f = 0; f < filas; f++) {
        int suma = 0;
        for (int c = 0; c < columnas; c++) {
            suma += matriz[f][c];
        }
        printf("Aula %d: %d\n", f + 1, suma);
    }
    return 0;
}
