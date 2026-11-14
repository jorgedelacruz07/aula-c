/* Una lista de aportes que crece.
 * realloc puede mover la reserva; actualizar el puntero solo tras comprobar éxito conserva la
 * propiedad de la memoria.
 */
#include <stdio.h>
#include <stdlib.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}

int main(void) {
    int *datos = NULL;
    int cantidad = 0, x;
    while (1) {
        if (scanf("%d", &x) != 1) {
            free(datos);
            return invalido();
        }
        if (x == -1) {
            break;
        }
        if (x < 0 || x > 1000 || cantidad == 100) {
            free(datos);
            return invalido();
        }
        /* temporal preserva la reserva anterior si realloc falla. */
        int *temporal = realloc(datos, (size_t)(cantidad + 1) * sizeof *datos);
        if (!temporal) {
            free(datos);
            puts("Sin memoria");
            return 1;
        }
        datos = temporal;
        datos[cantidad++] = x;
    }
    if (cantidad == 0) {
        puts("Vacio");
    } else {
        for (int i = 0; i < cantidad; i++) {
            printf("%s%d", i ? " " : "", datos[i]);
        }
        putchar('\n');
    }
    free(datos);
    return 0;
}
