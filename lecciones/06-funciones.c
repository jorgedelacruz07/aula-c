#include <stdio.h>
int cuadrado(int valor); /* Prototipo: contrato visible antes de main. */
int main(void) {
    int n;
    if (scanf("%d", &n) != 1 || n < -100 || n > 100) return 1;
    printf("Cuadrado: %d\n", cuadrado(n));
    return 0;
}
int cuadrado(int valor) {
    return valor * valor; /* El parámetro es una copia. */
}
