/* Repartir 73 fichas entre 6 equipos.
 * La división entre int produce un cociente entero; el residuo permite conservar la cantidad total.
 */
#include <stdio.h>

int main(void) {
    int fichas = 73, equipos = 6;
    /* / cuenta lotes completos; % conserva lo que no alcanza para otro lote. */
    printf("Por equipo: %d\n", fichas / equipos);
    printf("Reserva: %d\n", fichas % equipos);
    return 0;
}
