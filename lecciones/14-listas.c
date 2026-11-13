#include <stdio.h>
struct Nodo { int dato; struct Nodo *siguiente; };
int main(void) {
    struct Nodo segundo = {20, NULL};
    struct Nodo primero = {10, &segundo};
    struct Nodo *actual = &primero;
    while (actual != NULL) {
        printf("%d\n", actual->dato);
        actual = actual->siguiente; /* Avanzamos al siguiente nodo. */
    }
    /* Son objetos locales: no corresponden llamadas a free. */
    return 0;
}
