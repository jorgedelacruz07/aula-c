#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *valores = malloc(3 * sizeof *valores);
    int i, suma = 0;
    if (valores == NULL) return 1; /* Nunca usar una reserva fallida. */
    for (i = 0; i < 3; i++) {
        valores[i] = (i + 1) * 10;
        suma += valores[i];
    }
    printf("Suma: %d\n", suma);
    free(valores); /* Una liberación por reserva; no usar después. */
    return 0;
}
