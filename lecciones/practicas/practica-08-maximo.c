/* La lectura más alta de un sensor.
 * Un índice identifica la posición; almacenar el índice permite recuperar tanto el valor como su
 * ubicación.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}

int main(void) {
    int n, datos[20], posicion = 0;
    if (scanf("%d", &n) != 1 || n < 1 || n > 20) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &datos[i]) != 1 || datos[i] < -1000 || datos[i] > 1000) {
            return invalido();
        }
    }
    for (int i = 1; i < n; i++) {
        if (datos[i] > datos[posicion]) {
            posicion = i;
        }
    }
    printf("Max: %d\nPosicion: %d\n", datos[posicion], posicion);
    return 0;
}
