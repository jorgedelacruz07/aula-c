/* Medir un mensaje de atención.
 * Una cadena de C termina en un byte nulo; la capacidad del arreglo debe incluirlo además del
 * texto.
 */
#include <stdio.h>
#include <string.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
/* Lee una linea de hasta 80 caracteres; no cuenta el salto final. */
static int leer_linea(char texto[82]) {
    if (!fgets(texto, 82, stdin)) {
        return 0;
    }
    size_t n = strcspn(texto, "\n");
    if (n > 80) {
        return 0;
    }
    texto[n] = '\0';
    return 1;
}

int main(void) {
    char texto[82];
    if (!leer_linea(texto)) {
        return invalido();
    }
    size_t longitud = 0;
    while (texto[longitud] != '\0') {
        longitud++;
    }
    printf("Longitud: %zu\n", longitud);
    return 0;
}
