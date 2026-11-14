/* Sumar áreas de baldosas.
 * El acumulador representa una suma parcial y la variable de control garantiza progreso.
 */
#include <stdio.h>

int main(void) {
    int n, suma = 0;
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        puts("Entrada invalida");
        return 1;
    }
    /* Invariante: suma contiene los cuadrados ya procesados. */
    for (int i = 1; i <= n; i++) {
        suma += i * i;
    }
    printf("Suma: %d\n", suma);
    return 0;
}
