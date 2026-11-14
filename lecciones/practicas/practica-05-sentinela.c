/* Una colecta que termina con -1.
 * Un ciclo por centinela termina por el significado de un dato; el dato de control no se procesa
 * como aporte.
 */
#include <stdio.h>

int main(void) {
    int x, cantidad = 0, total = 0;
    while (1) {
        if (scanf("%d", &x) != 1) {
            puts("Entrada invalida");
            return 1;
        }
        if (x == -1) {
            break;
        }
        if (x < 0 || x > 1000 || cantidad == 100) {
            puts("Entrada invalida");
            return 1;
        }
        total += x;
        cantidad++;
    }
    printf("Aportes: %d\nTotal: %d\n", cantidad, total);
    return 0;
}
