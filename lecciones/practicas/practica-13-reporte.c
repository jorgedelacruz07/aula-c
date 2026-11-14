/* Un reporte leído hasta el fin de archivo.
 * EOF se conoce después de intentar leer; la condición de conversión controla si el dato es válido
 * para procesar.
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
    int n, datos[20];
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return invalido();
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &datos[i]) != 1 || datos[i] < -1000 || datos[i] > 1000) {
            return invalido();
        }
    }
    FILE *archivo = fopen("mediciones.txt", "w");
    if (!archivo) {
        return error_archivo(NULL);
    }
    for (int i = 0; i < n; i++) {
        if (fprintf(archivo, "%d\n", datos[i]) < 0) {
            return error_archivo(archivo);
        }
    }
    if (fclose(archivo) != 0) {
        return error_archivo(NULL);
    }
    archivo = fopen("mediciones.txt", "r");
    if (!archivo) {
        return error_archivo(NULL);
    }
    int dato, estado, cantidad = 0, suma = 0;
    while ((estado = fscanf(archivo, "%d", &dato)) == 1) {
        cantidad++;
        suma += dato;
    }
    if (estado != EOF || ferror(archivo)) {
        return error_archivo(archivo);
    }
    if (fclose(archivo) != 0) {
        return error_archivo(NULL);
    }
    printf("Registros: %d\nSuma: %d\n", cantidad, suma);
    return 0;
}
