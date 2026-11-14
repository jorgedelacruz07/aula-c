/* Sincronizar dos señales.
 * Los parámetros se copian: la función puede reducir sus copias sin cambiar las variables de main.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static int mcd(int a, int b) {
    while (b != 0) {
        int resto = a % b;
        a = b;
        b = resto;
    }
    return a;
}

int main(void) {
    int a, b;
    if (scanf("%d%d", &a, &b) != 2 || a < 1 || a > 1000000 || b < 1 || b > 1000000) {
        return invalido();
    }
    printf("MCD: %d\n", mcd(a, b));
    return 0;
}
