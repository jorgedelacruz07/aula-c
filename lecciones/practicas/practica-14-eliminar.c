/* Retirar todos los turnos cancelados.
 * Modificar el enlace entrante evita casos especiales para la cabeza y permite retirar varios nodos
 * consecutivos sin perder el recorrido.
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
    int n, objetivo;
    struct Nodo *cabeza = NULL, *cola = NULL;
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
        nuevo->siguiente = NULL;
        if (cola == NULL) {
            cabeza = nuevo;
        } else {
            cola->siguiente = nuevo;
        }
        cola = nuevo;
    }
    if (scanf("%d", &objetivo) != 1 || objetivo < -1000 || objetivo > 1000) {
        liberar(cabeza);
        return invalido();
    }
    /* enlace apunta al puntero que debe cambiar si retiramos el nodo. */
    struct Nodo **enlace = &cabeza;
    while (*enlace != NULL) {
        struct Nodo *actual = *enlace;
        if (actual->dato == objetivo) {
            *enlace = actual->siguiente;
            free(actual);
        } else {
            enlace = &actual->siguiente;
        }
    }
    mostrar(cabeza);
    liberar(cabeza);
    return 0;
}
