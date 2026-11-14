/* Medir una variación de nivel.
 * Comprobar dos conversiones garantiza que ambos objetos contienen datos antes de restar.
 */
#include <stdio.h>

int main(void) {
    int inicial, final;
    if (scanf("%d%d", &inicial, &final) != 2 || inicial < 0 || inicial > 1000 || final < 0 ||
        final > 1000) {
        puts("Entrada invalida");
        return 1;
    }
    /* El signo informa si el tanque subio o bajo. */
    printf("Variacion: %d\n", final - inicial);
    return 0;
}
