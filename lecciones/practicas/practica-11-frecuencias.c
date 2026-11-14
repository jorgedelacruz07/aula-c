/* Contar categorías con calloc.
 * Una frecuencia usa el valor como índice y por eso la validación debe preceder al acceso.
 */
#include <stdio.h>
#include <stdlib.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return invalido();
    }
    int *frecuencias = calloc(10, sizeof *frecuencias);
    if (!frecuencias) {
        puts("Sin memoria");
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int categoria;
        if (scanf("%d", &categoria) != 1 || categoria < 0 || categoria > 9) {
            free(frecuencias);
            return invalido();
        }
        frecuencias[categoria]++;
    }
    for (int i = 0; i < 10; i++) {
        printf("%s%d", i ? " " : "", frecuencias[i]);
    }
    putchar('\n');
    free(frecuencias);
    return 0;
}
