/* Un lote de mediciones de tamaño variable.
 * sizeof *datos relaciona la reserva con el tipo apuntado; la propiedad de la memoria exige
 * liberarla en todos los caminos.
 */
#include <stdio.h>
#include <stdlib.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 500) {
        return invalido();
    }
    if (n == 0) {
        puts("Sin datos");
        return 0;
    }
    int *datos = malloc((size_t)n * sizeof *datos);
    if (datos == NULL) {
        puts("Sin memoria");
        return 1;
    }
    int suma = 0;
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &datos[i]) != 1 || datos[i] < -1000 || datos[i] > 1000) {
            free(datos);
            return invalido();
        }
        suma += datos[i];
    }
    printf("Promedio: %.2f\n", (double)suma / n);
    free(datos);
    return 0;
}
