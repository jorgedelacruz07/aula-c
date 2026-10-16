/*
 * =============================================================================
 *  EJERCICIO A1 - NUMEROS FELICES E INFELICES PRIMOS (Guía PUCP 2.3.1)
 *  Nivel : Avanzado (Composición de 5 módulos exactos + descomposición iterativa)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Un número entero positivo se llama FELIZ si al reemplazarlo repetidamente
 *  por la suma de los cuadrados de sus dígitos se llega al número 1 en como
 *  máximo 8 iteraciones. Si supera las 8 iteraciones sin llegar a 1, se
 *  considera INFELIZ.
 *
 *  Ejemplo con n = 19:
 *    Iteración 1: 1^2 + 9^2 = 82
 *    Iteración 2: 8^2 + 2^2 = 68
 *    Iteración 3: 6^2 + 8^2 = 100
 *    Iteración 4: 1^2 + 0^2 + 0^2 = 1  -> Llega a 1 en 4 iteraciones (<= 8).
 *    Además 19 es primo -> 19 es un "numero primo feliz".
 *
 *  Leer un entero de 2 cifras y determinar si es feliz o infeliz, y si además
 *  es primo ("primo feliz", "primo infeliz", "feliz (no es primo)" o
 *  "infeliz (no es primo)").
 *
 *  Módulos exactos requeridos:
 *    1) void leer_datos(int *n);
 *    2) int cant_digitos(int n);
 *    3) int sum_digits_al_cuadrado(int n);
 *    4) int es_feliz(int n);
 *    5) int es_primo(int n);
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>
#include <math.h>

/* PROCEDIMIENTO: lee el número entero por referencia. */
void leer_datos(int *n);

/* FUNCIÓN: retorna la cantidad de dígitos de n sin usar bucles (con log10). */
int cant_digitos(int n);

/* FUNCIÓN: retorna la suma de los cuadrados de los dígitos de n. */
int sum_digits_al_cuadrado(int n);

/* FUNCIÓN: retorna 1 si n llega a 1 en máximo 8 iteraciones, 0 en caso contrario. */
int es_feliz(int n);

/* FUNCIÓN: retorna 1 si n es un número primo, 0 en caso contrario. */
int es_primo(int n);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int n, feliz, primo;

    leer_datos(&n);

    if (cant_digitos(n) == 2) {
        feliz = es_feliz(n);
        primo = es_primo(n);

        if (primo && feliz) {
            printf("El numero %d es un NUMERO PRIMO FELIZ\n", n);
        } else if (primo && !feliz) {
            printf("El numero %d es un NUMERO PRIMO INFELIZ\n", n);
        } else if (!primo && feliz) {
            printf("El numero %d es un NUMERO FELIZ (no es primo)\n", n);
        } else {
            printf("El numero %d es un NUMERO INFELIZ (no es primo)\n", n);
        }
    } else {
        printf("Error: el numero ingresado debe ser positivo de exactamente 2 cifras\n");
    }

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_datos
 */
void leer_datos(int *n) {
    printf("Ingrese un numero entero positivo de 2 cifras: ");
    scanf("%d", n);
}

/*
 * FUNCIÓN cant_digitos
 * Expresión '(int)log10(n) + 1':
 * Calcula la cantidad de cifras de un entero positivo 'n' en tiempo constante
 * sin emplear un bucle. Por ejemplo, para n = 19, log10(19) = 1.2787..., que
 * al truncarse con '(int)' da 1, y al sumarle 1 entrega 2 cifras.
 */
int cant_digitos(int n) {
    int digitos = 0;

    if (n > 0) {
        digitos = (int)log10(n) + 1;
    }

    return digitos;
}

/*
 * FUNCIÓN sum_digits_al_cuadrado
 * Descomposición de dígitos por valor:
 * - 'digito = n % 10' obtiene la cifra de las unidades.
 * - 'n = n / 10' elimina la cifra de las unidades mediante división entera.
 * Dado que 'n' se recibe por valor (copia local), modificar 'n' dentro de esta
 * función no altera la variable del módulo que la llamó.
 */
int sum_digits_al_cuadrado(int n) {
    int suma = 0;
    int digito;

    while (n > 0) {
        digito = n % 10;
        suma = suma + digito * digito;
        n = n / 10;
    }

    return suma;
}

/*
 * FUNCIÓN es_feliz
 * Cómo evitar bucles anidados mediante composición modular:
 * - Esta función controla el número de transformaciones (hasta 8 iteraciones)
 *   y delega la descomposición de cada número a 'sum_digits_al_cuadrado(n)'.
 * - La condición compuesta 'while (iteracion <= 8 && n != 1)' detiene el bucle
 *   en cuanto 'n' alcanza el valor 1 o cuando se completan las 8 iteraciones.
 */
int es_feliz(int n) {
    int iteracion = 1;
    int resultado = 0;

    while (iteracion <= 8 && n != 1) {
        n = sum_digits_al_cuadrado(n);
        iteracion = iteracion + 1;
    }

    if (n == 1) {
        resultado = 1;
    }

    return resultado;
}

/*
 * FUNCIÓN es_primo
 * Verificación de primalidad hasta la raíz cuadrada ('divisor * divisor <= n'):
 * Si un número 'n' es compuesto, necesariamente posee al menos un divisor menor
 * o igual que su raíz cuadrada. Evaluar 'divisor * divisor <= n' equivale a
 * 'divisor <= sqrt(n)', pero operando exclusivamente con aritmética entera.
 * La bandera 'tiene_divisor' detiene la búsqueda apenas se halla un divisor.
 */
int es_primo(int n) {
    int divisor = 2;
    int tiene_divisor = 0;
    int primo = 0;

    if (n >= 2) {
        while (divisor * divisor <= n && !tiene_divisor) {
            if (n % divisor == 0) {
                tiene_divisor = 1;
            }
            divisor = divisor + 1;
        }
        primo = !tiene_divisor;
    }

    return primo;
}
