/* Apilar tarjetas al inicio.
 * Insertar al inicio invierte el orden de llegada; los enlaces deben guardarse antes de reemplazar
 * la cabeza.
 */
#include <stdio.h>
#include <stdlib.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
struct Nodo {
    int dato;
    struct Nodo *siguiente;
};
static void liberar(struct Nodo *cabeza) {
    while (cabeza != NULL) {
        struct Nodo *siguiente = cabeza->siguiente;
        free(cabeza);
        cabeza = siguiente;
    }
}
static void mostrar(const struct Nodo *cabeza) {
    if (cabeza == NULL) {
        puts("Vacio");
        return;
    }
    int primero = 1;
    for (const struct Nodo *p = cabeza; p != NULL; p = p->siguiente) {
        printf("%s%d", primero ? "" : " ", p->dato);
        primero = 0;
    }
    putchar('\n');
}

int main(void) {
    int n;
    struct Nodo *cabeza = NULL;
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        int dato;
        if (scanf("%d", &dato) != 1 || dato < -1000 || dato > 1000) {
            liberar(cabeza);
            return invalido();
        }
        struct Nodo *nuevo = malloc(sizeof *nuevo);
        if (!nuevo) {
            liberar(cabeza);
            puts("Sin memoria");
            return 1;
        }
        nuevo->dato = dato;
        nuevo->siguiente = cabeza;
        cabeza = nuevo;
    }
    mostrar(cabeza);
    liberar(cabeza);
    return 0;
}
