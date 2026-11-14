/* Obtener mínimo y máximo por dirección.
 * Inicializar con un dato preserva el dominio real de las mediciones; los punteros devuelven ambos
 * extremos.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static void extremos(int a, int b, int c, int *menor, int *mayor) {
    *menor = a;
    *mayor = a;
    if (b < *menor) {
        *menor = b;
    }
    if (c < *menor) {
        *menor = c;
    }
    if (b > *mayor) {
        *mayor = b;
    }
    if (c > *mayor) {
        *mayor = c;
    }
}

int main(void) {
    int a, b, c, menor, mayor;
    if (scanf("%d%d%d", &a, &b, &c) != 3 || a < -1000 || a > 1000 || b < -1000 || b > 1000 ||
        c < -1000 || c > 1000) {
        return invalido();
    }
    extremos(a, b, c, &menor, &mayor);
    printf("Min: %d\nMax: %d\n", menor, mayor);
    return 0;
}
