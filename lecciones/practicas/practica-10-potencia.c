/* Potencias con menos llamadas.
 * Dividir el exponente reduce la profundidad a orden logarítmico; almacenar la llamada evita
 * repetir trabajo.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static long long potencia(int base, int exponente) {
    if (exponente == 0) {
        return 1;
    }
    long long mitad = potencia(base, exponente / 2);
    long long resultado = mitad * mitad;
    if (exponente % 2 != 0) {
        resultado *= base;
    }
    return resultado;
}

int main(void) {
    int base, exponente;
    if (scanf("%d%d", &base, &exponente) != 2 || base < -9 || base > 9 || exponente < 0 ||
        exponente > 18) {
        return invalido();
    }
    printf("Potencia: %lld\n", potencia(base, exponente));
    return 0;
}
