//
//  b4.c
//  MyTool
//
//  Created by Jorge de la Cruz Padilla on 16/10/26.
//

#include <stdio.h>

/* Prototipo de la función */
int fibonacci(int n);

int main(void) {
    int n;

    printf("Ingresa el término n de la serie Fibonacci a calcular: ");
    if (scanf("%d", &n) != 1 || n < 0) {
        printf("Error: Debes ingresar un número entero mayor o igual a 0.\n");
        return 1;
    }

    int resultado = fibonacci(n);
    printf("Fibonacci(%d) = %d\n", n, resultado);

    return 0;
}

/*
 * Calcula el n-ésimo término de la serie de Fibonacci usando un bucle while.
 * F(0) = 0, F(1) = 1, F(2) = 1, F(3) = 2, ...
 */
int fibonacci(int n) {
    if (n < 0) {
        return -1;
    }
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return 1;
    }

    int prev2 = 0; // F(i-2)
    int prev1 = 1; // F(i-1)
    int actual = 0;
    int i = 2;

    while (i <= n) {
        actual = prev1 + prev2;
        prev2 = prev1;
        prev1 = actual;
        i++;
    }

    return actual;
}
