/* Un código que se lee al revés.
 * El intervalo de índices expresa el subproblema y garantiza que no se acceda a una posición fuera
 * de la cadena.
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
static int palindromo(const char *texto, int izquierda, int derecha) {
    if (izquierda >= derecha) {
        return 1;
    }
    if (texto[izquierda] != texto[derecha]) {
        return 0;
    }
    return palindromo(texto, izquierda + 1, derecha - 1);
}

int main(void) {
    char texto[82];
    if (!leer_linea(texto)) {
        return invalido();
    }
    int derecha = (int)strlen(texto) - 1;
    puts(palindromo(texto, 0, derecha) ? "Palindromo" : "Distinto");
    return 0;
}
