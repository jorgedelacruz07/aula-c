/* Dos resultados de una división.
 * Los parámetros de salida separan el valor retornado por una función de los objetos que puede
 * modificar por dirección.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
/* b>0; q y r deben apuntar a objetos distintos y validos. */
static void dividir(int a, int b, int *q, int *r) {
    *q = a / b;
    *r = a % b;
}

int main(void) {
    int a, b, cociente, resto;
    if (scanf("%d%d", &a, &b) != 2 || a < 0 || a > 10000 || b < 1 || b > 100) {
        return invalido();
    }
    dividir(a, b, &cociente, &resto);
    printf("Cociente: %d\nResto: %d\n", cociente, resto);
    return 0;
}
