#include <stdio.h>
int main(void) {
    /* Este WASI requiere ruta absoluta; Xcode usa el directorio de trabajo. */
#ifdef __wasi__
    const char *ruta = "/datos.txt";
#else
    const char *ruta = "aula-c-practica.txt";
#endif
    FILE *archivo = fopen(ruta, "w+"); /* w+ crea o reemplaza el archivo. */
    int valor;
    if (archivo == NULL) return 1;
    if (fprintf(archivo, "42\n") < 0) { fclose(archivo); return 1; }
    rewind(archivo); /* Cambia de escritura a lectura desde el inicio. */
    if (fscanf(archivo, "%d", &valor) != 1) { fclose(archivo); return 1; }
    printf("Leido: %d\n", valor);
    return fclose(archivo) == 0 ? 0 : 1;
}
