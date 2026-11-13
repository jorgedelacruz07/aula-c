#include <stdio.h>
int main(void) {
    int n, i = 1, suma = 0;
    /* Acotamos n para que la suma quepa incluso en int de 16 bits. */
    if (scanf("%d", &n) != 1 || n < 0 || n > 200) return 1;
    while (i <= n) {
        suma += i; /* Equivale a suma = suma + i. */
        i++; /* Sin progreso, la condición nunca dejaría de cumplirse. */
    }
    printf("Suma: %d\n", suma);
    return 0;
}
