#include <stdio.h>
struct Alumno { int codigo; double nota; };
int main(void) {
    struct Alumno alumno = {101, 16.5};
    struct Alumno *p = &alumno;
    p->nota += 0.5; /* Equivale a (*p).nota += 0.5. */
    printf("Alumno %d: %.1f\n", alumno.codigo, alumno.nota);
    return 0;
}
