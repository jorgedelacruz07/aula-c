/* Una cita en una pantalla.
 * Los escapes distinguen los delimitadores del lenguaje de los caracteres que quieres mostrar.
 */
#include <stdio.h>

int main(void) {
    /* Las barras y comillas de la salida necesitan escapes en C. */
    printf("Dijo: \"Practica C\"\n");
    printf("C:\\aula\\hola.c\n");
    return 0;
}
