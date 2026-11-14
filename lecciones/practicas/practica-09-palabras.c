/* Contar palabras en una cola de atención.
 * La bandera resume el estado del recorrido; contar transiciones evita contar espacios como
 * palabras.
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
    int dentro = 0, cantidad = 0;
    for (size_t i = 0; texto[i] != '\0'; i++) {
        if (texto[i] == ' ' || texto[i] == '\t') {
            dentro = 0;
        } else if (!dentro) {
            cantidad++;
            dentro = 1;
        }
    }
    printf("Palabras: %d\n", cantidad);
    return 0;
}
