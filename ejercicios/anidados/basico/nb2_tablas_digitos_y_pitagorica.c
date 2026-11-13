#include <stdio.h>

/* [PARA MAURICIO - PUCP] Potencias de diez permiten visitar los dígitos de izquierda a derecha.
   [NOTA TÉCNICA - JORGE] El modo 1 limita n para mantener el formato de columnas legible. */
void tablas_digitos(int n);
void tabla_pitagorica(int n);
int potencia10(int exp);

int main(void)
{
    int opcion, n;
    printf("1 Tablas por digito | 2 Pitagorica: ");
    if (scanf("%d", &opcion) != 1) return 1;
    if (opcion == 1) {
        if (scanf("%d", &n) != 1 || n < 1 || n > 999999) return 1;
        tablas_digitos(n);
    } else if (opcion == 2) {
        if (scanf("%d", &n) != 1 || n < 1 || n > 10) return 1;
        tabla_pitagorica(n);
    } else return 1;
    return 0;
}

void tablas_digitos(int n)
{
    int digitos = 0, copia = n, p, d, k;
    while (copia > 0) { digitos++; copia /= 10; }
    for (k = 1; k <= 12; k++) {
        for (p = potencia10(digitos - 1); p > 0; p /= 10) {
            d = (n / p) % 10;
            printf("%02d x %02d = %02d  ", d, k, d * k);
        }
        printf("\n");
    }
}

void tabla_pitagorica(int n)
{
    int fila, col;
    for (fila = n; fila >= 0; fila--) {
        for (col = 0; col <= 10; col++) printf("%02d ", fila * col);
        printf("\n");
    }
}

int potencia10(int exp)
{
    int p = 1, i;
    for (i = 0; i < exp; i++) p *= 10;
    return p;
}
