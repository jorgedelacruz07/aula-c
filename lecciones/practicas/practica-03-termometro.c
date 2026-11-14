/* Registrar una temperatura.
 * &t entrega una dirección donde scanf puede escribir; || evita leer t si la conversión falló.
 */
#include <stdio.h>

int main(void) {
    int t;
    if (scanf("%d", &t) != 1 || t < -50 || t > 60) {
        puts("Entrada invalida");
        return 1;
    }
    printf("Temperatura: %d\n", t);
    return 0;
}
