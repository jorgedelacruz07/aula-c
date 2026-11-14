/* Auditar la suma de dígitos.
 * La recursión delega un problema más pequeño y combina su resultado con el dígito retirado.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static int sumar_digitos(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + sumar_digitos(n / 10);
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 1000000000) {
        return invalido();
    }
    printf("Digitos: %d\n", sumar_digitos(n));
    return 0;
}
