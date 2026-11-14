/* Conciliar un archivo de ventas.
 * El formato persistido es un contrato distinto de la entrada: la coma es parte del CSV y debe
 * leerse explícitamente.
 */
#include <stdio.h>

static int invalido(void) {
    puts("Entrada invalida");
    return 1;
}
static int error_archivo(FILE *archivo) {
    if (archivo != NULL) {
        fclose(archivo);
    }
    puts("Error de archivo");
    return 1;
}

int main(void) {
    int n, cantidades[20], precios[20];
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &cantidades[i], &precios[i]) != 2 || cantidades[i] < 0 ||
            cantidades[i] > 100 || precios[i] < 0 || precios[i] > 100000) {
            return invalido();
        }
    }
    FILE *archivo = fopen("ventas.csv", "w");
    if (!archivo) {
        return error_archivo(NULL);
    }
    for (int i = 0; i < n; i++) {
        if (fprintf(archivo, "%d,%d\n", cantidades[i], precios[i]) < 0) {
            return error_archivo(archivo);
        }
    }
    if (fclose(archivo) != 0) {
        return error_archivo(NULL);
    }
    archivo = fopen("ventas.csv", "r");
    if (!archivo) {
        return error_archivo(NULL);
    }
    int cantidad, precio, estado, filas = 0, total = 0;
    while ((estado = fscanf(archivo, "%d,%d", &cantidad, &precio)) == 2) {
        if (cantidad < 0 || cantidad > 100 || precio < 0 || precio > 100000 || filas == 20) {
            return error_archivo(archivo);
        }
        total += cantidad * precio;
        filas++;
    }
    if (estado != EOF || ferror(archivo) || filas != n) {
        return error_archivo(archivo);
    }
    if (fclose(archivo) != 0) {
        return error_archivo(NULL);
    }
    printf("Centimos: %d\n", total);
    return 0;
}
