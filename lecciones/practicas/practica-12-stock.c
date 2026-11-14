/* Atender un pedido de almacén.
 * La estructura mantiene unido el identificador con su estado; el contrato impide stocks negativos
 * y códigos ambiguos.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
struct Producto {
    int codigo, stock;
};

int main(void) {
    int n, codigo, cantidad;
    struct Producto productos[10];
    if (scanf("%d", &n) != 1 || n < 1 || n > 10) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &productos[i].codigo, &productos[i].stock) != 2 ||
            productos[i].codigo < 1 || productos[i].codigo > 999 || productos[i].stock < 0 ||
            productos[i].stock > 1000) {
            return invalido();
        }
        for (int j = 0; j < i; j++) {
            if (productos[j].codigo == productos[i].codigo) {
                return invalido();
            }
        }
    }
    if (scanf("%d%d", &codigo, &cantidad) != 2 || codigo < 1 || codigo > 999 || cantidad < 1 ||
        cantidad > 1000) {
        return invalido();
    }
    int posicion = -1;
    for (int i = 0; i < n; i++) {
        if (productos[i].codigo == codigo) {
            posicion = i;
        }
    }
    if (posicion < 0) {
        puts("No existe");
    } else if (productos[posicion].stock < cantidad) {
        puts("Insuficiente");
    } else {
        productos[posicion].stock -= cantidad;
        printf("Stock: %d\n", productos[posicion].stock);
    }
    return 0;
}
