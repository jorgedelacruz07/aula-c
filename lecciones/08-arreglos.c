#include <stdio.h>
int main(void) {
    int notas[] = {12, 16, 14, 18};
    int suma = 0;
    unsigned int i;
    for (i = 0; i < sizeof notas / sizeof notas[0]; i++) {
        suma += notas[i]; /* El último índice válido es 3. */
    }
    printf("Promedio: %.1f\n", suma / 4.0);
    return 0;
}
