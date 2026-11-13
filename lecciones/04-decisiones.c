#include <stdio.h>
int main(void) {
    int nota;
    if (scanf("%d", &nota) != 1) return 1;
    /* Primero validamos el dominio; después clasificamos la nota. */
    if (nota < 0 || nota > 20) {
        printf("Fuera de rango\n");
    } else if (nota >= 11) {
        printf("Aprobado\n");
    } else {
        printf("Por reforzar\n");
    }
    return 0;
}
