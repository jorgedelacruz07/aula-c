/* Vocales en un aviso.
 * Una cadena puede recorrerse sin conocer su longitud previa; strchr consulta si un carácter
 * pertenece a otro texto.
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
    int cantidad = 0;
    for (size_t i = 0; texto[i] != '\0'; i++) {
        if (strchr("aeiouAEIOU", texto[i]) != NULL) {
            cantidad++;
        }
    }
    printf("Vocales: %d\n", cantidad);
    return 0;
}
