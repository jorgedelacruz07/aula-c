#include <stdio.h>
int main(void) {
    int a = 7, b = 2; /* = inicializa; no compara. */
    double cociente = (double)a / b; /* Convertimos ANTES de dividir. */
    printf("Entera: %d\n", a / b);
    printf("Real: %.2f\n", cociente); /* Dos decimales en la presentación. */
    printf("Residuo: %d\n", a % b);
    return 0;
}
