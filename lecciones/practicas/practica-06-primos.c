/* Contar identificadores primos.
 * La función predicado expresa una propiedad y el ciclo exterior cuenta cuántos elementos la
 * cumplen.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static int es_primo(int n) {
    if (n < 2) {
        return 0;
    }
    /* n/d evita multiplicaciones que podrian desbordarse en otra escala. */
    for (int d = 2; d <= n / d; d++) {
        if (n % d == 0) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int n, cantidad = 0;
    if (scanf("%d", &n) != 1 || n < 1 || n > 2000) {
        return invalido();
    }
    for (int x = 1; x <= n; x++) {
        cantidad += es_primo(x);
    }
    printf("Primos: %d\n", cantidad);
    return 0;
}
