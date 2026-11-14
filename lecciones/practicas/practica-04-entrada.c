/* Tarifa de una exposición.
 * Las ramas ordenadas permiten expresar intervalos sin repetir todas las condiciones.
 */
#include <stdio.h>

int main(void) {
    int edad;
    if (scanf("%d", &edad) != 1 || edad < 0 || edad > 120) {
        puts("Entrada invalida");
        return 1;
    }
    if (edad < 6) {
        puts("Gratis");
    } else if (edad < 18) {
        puts("Escolar");
    } else if (edad < 65) {
        puts("General");
    } else {
        puts("Senior");
    }
    return 0;
}
