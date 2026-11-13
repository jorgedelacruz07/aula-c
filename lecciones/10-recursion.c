#include <stdio.h>
double factorial(int n) {
    if (n == 0) return 1.0; /* Caso base: 0! = 1. */
    return n * factorial(n - 1); /* n disminuye hacia el caso base. */
}
int main(void) {
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) return 1;
    printf("Factorial: %.0f\n", factorial(n));
    return 0;
}
