/* Buscar un código ordenado.
 * La búsqueda binaria descarta un intervalo gracias a la precondición de orden; continuar a la
 * izquierda resuelve duplicados.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}

int main(void) {
    int n, a[20], objetivo, encontrado = -1;
    if (scanf("%d", &n) != 1 || n < 1 || n > 20) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < 0 || a[i] > 1000) {
            return invalido();
        }
        if (i > 0 && a[i] < a[i - 1]) {
            return invalido();
        }
    }
    if (scanf("%d", &objetivo) != 1 || objetivo < 0 || objetivo > 1000) {
        return invalido();
    }
    int izquierda = 0, derecha = n - 1;
    while (izquierda <= derecha) {
        int medio = izquierda + (derecha - izquierda) / 2;
        if (a[medio] >= objetivo) {
            if (a[medio] == objetivo) {
                encontrado = medio;
            }
            derecha = medio - 1;
        } else {
            izquierda = medio + 1;
        }
    }
    printf("Posicion: %d\n", encontrado);
    return 0;
}
