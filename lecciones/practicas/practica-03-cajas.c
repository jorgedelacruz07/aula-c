/* Empacar unidades con divisor válido.
 * La validación protege la precondición de / y %: su segundo operando debe ser distinto de cero.
 */
#include <stdio.h>

int main(void) {
    int unidades, capacidad;
    if (scanf("%d%d", &unidades, &capacidad) != 2 || unidades < 0 || unidades > 10000 ||
        capacidad < 1 || capacidad > 100) {
        puts("Entrada invalida");
        return 1;
    }
    printf("Completas: %d\nSobrantes: %d\n", unidades / capacidad, unidades % capacidad);
    return 0;
}
