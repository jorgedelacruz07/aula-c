/* Intercambiar dos casilleros.
 * C copia los valores de puntero; la indirección permite modificar los objetos originales.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static void intercambiar(int *a, int *b) {
    int temporal = *a;
    *a = *b;
    *b = temporal;
}

int main(void) {
    int a, b;
    if (scanf("%d%d", &a, &b) != 2 || a < -1000 || a > 1000 || b < -1000 || b > 1000) {
        return invalido();
    }
    intercambiar(&a, &b);
    printf("%d %d\n", a, b);
    return 0;
}
