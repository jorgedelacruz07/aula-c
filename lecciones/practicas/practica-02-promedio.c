/* Un promedio que conserva decimales.
 * El tipo de los operandos determina la división antes de asignar a double; el formato controla la
 * presentación.
 */
#include <stdio.h>

int main(void) {
    int a = 17, b = 14, c = 18;
    /* 3.0 fuerza division real antes de asignar. */
    double promedio = (a + b + c) / 3.0;
    printf("Promedio: %.2f\n", promedio);
    return 0;
}
