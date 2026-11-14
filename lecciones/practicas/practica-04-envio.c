/* Costo de envío por tramos.
 * Separar por tramos conserva el costo ya acumulado y hace visibles los límites.
 */
#include <stdio.h>

int main(void) {
    int km, costo;
    if (scanf("%d", &km) != 1 || km < 1 || km > 100) {
        puts("Entrada invalida");
        return 1;
    }
    /* Las cantidades monetarias enteras evitan redondeo binario. */
    if (km <= 10) {
        costo = 500 + 200 * (km - 1);
    } else {
        costo = 2300 + 150 * (km - 10);
    }
    printf("Centimos: %d\n", costo);
    return 0;
}
