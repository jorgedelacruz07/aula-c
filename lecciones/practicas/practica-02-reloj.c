/* Convertir 7384 segundos.
 * Cada cociente extrae una unidad y cada residuo conserva lo que falta convertir.
 */
#include <stdio.h>

int main(void) {
    int total = 7384;
    /* El modulo elimina las horas completas antes de calcular los minutos. */
    int horas = total / 3600;
    int minutos = (total % 3600) / 60;
    int segundos = total % 60;
    printf("%d h %d min %d s\n", horas, minutos, segundos);
    return 0;
}
