/* Elegir una postulación.
 * Un criterio compuesto define un orden por nota y código sin separar campos relacionados.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
struct Postulante {
    int codigo, nota;
};

int main(void) {
    int n;
    struct Postulante datos[20];
    if (scanf("%d", &n) != 1 || n < 1 || n > 20) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &datos[i].codigo, &datos[i].nota) != 2 || datos[i].codigo < 1 ||
            datos[i].codigo > 999 || datos[i].nota < 0 || datos[i].nota > 20) {
            return invalido();
        }
    }
    int elegido = 0;
    for (int i = 1; i < n; i++) {
        if (datos[i].nota > datos[elegido].nota ||
            (datos[i].nota == datos[elegido].nota && datos[i].codigo < datos[elegido].codigo)) {
            elegido = i;
        }
    }
    printf("Elegido: %d %d\n", datos[elegido].codigo, datos[elegido].nota);
    return 0;
}
