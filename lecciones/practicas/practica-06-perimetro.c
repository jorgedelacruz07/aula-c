/* Un marco hecho por una función.
 * Separar cálculo y entrada/salida permite reutilizar y probar la función con distintos argumentos.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
/* Contrato: dimensiones positivas; retorno en la misma unidad. */
static int perimetro(int base, int altura) {
    return 2 * (base + altura);
}

int main(void) {
    int base, altura;
    if (scanf("%d%d", &base, &altura) != 2 || base < 1 || base > 1000 || altura < 1 ||
        altura > 1000) {
        return invalido();
    }
    printf("Perimetro: %d\n", perimetro(base, altura));
    return 0;
}
