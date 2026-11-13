#include <stdio.h>
/* Precondición: a y b apuntan a enteros válidos y modificables. */
void intercambiar(int *a, int *b) {
    int temporal = *a; /* Guarda el valor antes de sobrescribirlo. */
    *a = *b;
    *b = temporal;
}
int main(void) {
    int x = 3, y = 8;
    intercambiar(&x, &y); /* Se copian direcciones, no los enteros. */
    printf("x=%d y=%d\n", x, y);
    return 0;
}
