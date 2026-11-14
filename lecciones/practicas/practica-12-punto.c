/* Recorrer cuadras entre dos puntos.
 * Una estructura agrupa campos de una entidad; el operador punto selecciona un campo del objeto.
 */
#include <stdio.h>
#include <stdlib.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
struct Punto {
    int x, y;
};

int main(void) {
    struct Punto a, b;
    if (scanf("%d%d%d%d", &a.x, &a.y, &b.x, &b.y) != 4 || a.x < -1000 || a.x > 1000 ||
        a.y < -1000 || a.y > 1000 || b.x < -1000 || b.x > 1000 || b.y < -1000 || b.y > 1000) {
        return invalido();
    }
    printf("Cuadras: %d\n", abs(b.x - a.x) + abs(b.y - a.y));
    return 0;
}
