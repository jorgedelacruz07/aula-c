/* Guardar y recuperar una lectura.
 * FILE* representa un flujo con estado y errores; cerrar confirma la escritura antes de recuperar
 * el dato.
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
    int lectura, recuperado;
    if (scanf("%d", &lectura) != 1 || lectura < -1000 || lectura > 1000) {
        return invalido();
    }
    FILE *archivo = fopen("registro.txt", "w");
    if (!archivo) {
        return error_archivo(NULL);
    }
    if (fprintf(archivo, "%d\n", lectura) < 0) {
        return error_archivo(archivo);
    }
    if (fclose(archivo) != 0) {
        return error_archivo(NULL);
    }
    archivo = fopen("registro.txt", "r");
    if (!archivo) {
        return error_archivo(NULL);
    }
    if (fscanf(archivo, "%d", &recuperado) != 1) {
        return error_archivo(archivo);
    }
    if (fclose(archivo) != 0) {
        return error_archivo(NULL);
    }
    printf("Recuperado: %d\n", recuperado);
    return 0;
}
