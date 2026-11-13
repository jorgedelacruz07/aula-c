#include <stdio.h>
#include <string.h>
int main(void) {
    char nombre[16]; /* Incluye espacio para el terminador nulo. */
    if (fgets(nombre, sizeof nombre, stdin) == NULL) return 1;
    nombre[strcspn(nombre, "\n")] = '\0'; /* Quita el salto si existe. */
    printf("Hola, %s\n", nombre);
    return 0;
}
