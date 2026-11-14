/* Una boleta alineada.
 * Un formato expresa cómo representar un dato. El signo menos alinea el campo a la izquierda.
 */
#include <stdio.h>

int main(void) {
    /* El ancho es un minimo de campo, no una cantidad de bytes reservados. */
    printf("%-12s%s\n", "ARTICULO", "TOTAL");
    printf("%-12s%d\n", "Pan", 6);
    printf("%-12s%d\n", "Leche", 8);
    return 0;
}
