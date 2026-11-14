/* ¿Se abre el 29 de febrero?.
 * Los conectores || y && combinan criterios; el residuo cero representa divisibilidad.
 */
#include <stdio.h>

int main(void) {
    int anio;
    if (scanf("%d", &anio) != 1 || anio < 1583 || anio > 9999) {
        puts("Entrada invalida");
        return 1;
    }
    if (anio % 400 == 0 || (anio % 4 == 0 && anio % 100 != 0)) {
        puts("Bisiesto");
    } else {
        puts("Comun");
    }
    return 0;
}
