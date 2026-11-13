#include <stdio.h>
int main(void) {
    int edad;
    /* || usa cortocircuito: si falla la lectura no evalúa edad < 0. */
    if (scanf("%d", &edad) != 1 || edad < 0 || edad > 130) {
        printf("Edad invalida\n");
        return 1;
    }
    printf("Edad: %d\n", edad);
    return 0;
}
