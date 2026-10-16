/*
 * =============================================================================
 *  EJERCICIO B1 - POLINOMIO COMPLETO (Guía PUCP 2.1.1)
 *  Nivel : Básico (Funciones simples, punteros básicos y bucle while directo)
 *  Curso : 1INF01 Fundamentos de Programación - EEGGCC PUCP
 * =============================================================================
 *  ENUNCIADO
 *  Un polinomio de grado n es COMPLETO si todos sus coeficientes, desde el
 *  término independiente (grado 0) hasta el término de grado n, son diferentes
 *  de cero.
 *
 *  Escriba un programa que lea el grado de un polinomio (entero >= 0) y luego
 *  lea iterativamente con un while los coeficientes desde el término 0 hasta
 *  el grado indicado.
 *
 *  Restricción modular:
 *  Implementar exactamente 3 módulos adicionales a main:
 *    1) leer_y_evaluar_polinomio: lee el grado y los coeficientes en un while.
 *    2) es_coeficiente_no_cero  : valida si un coeficiente es != 0 (1 o 0).
 *    3) imprimir_veredicto      : imprime si el polinomio es completo o no.
 * =============================================================================
 */

/* ======================= ZONA 1: INCLUDES Y PROTOTIPOS ===================== */
#include <stdio.h>

/*
 * Declaración de prototipos de los 3 módulos exigidos por el problema.
 * Cada prototipo termina con punto y coma (;) y define los tipos de entrada y salida.
 */

/* PROCEDIMIENTO: lee el grado y los coeficientes, y devuelve ambos resultados por referencia. */
void leer_y_evaluar_polinomio(int *grado, int *es_completo);

/* FUNCIÓN: retorna 1 si el coeficiente es diferente de 0, o 0 si vale 0. */
int es_coeficiente_no_cero(double coef);

/* PROCEDIMIENTO: muestra en pantalla si el polinomio es completo o incompleto. */
void imprimir_veredicto(int grado, int es_completo);

/* ======================= ZONA 2: MAIN (COORDINADOR) ======================== */
int main() {
    int grado, es_completo;

    /*
     * Se envían las direcciones de memoria '&grado' y '&es_completo' para que
     * el procedimiento 'leer_y_evaluar_polinomio' modifique directamente el
     * contenido de ambas variables locales de main.
     */
    leer_y_evaluar_polinomio(&grado, &es_completo);
    imprimir_veredicto(grado, es_completo);

    return 0;
}

/* ======================= ZONA 3: DEFINICION DE MODULOS ===================== */

/*
 * PROCEDIMIENTO leer_y_evaluar_polinomio
 * Lee el grado y los coeficientes de un polinomio con un bucle while,
 * determinando si es completo (todos los coeficientes != 0).
 */
void leer_y_evaluar_polinomio(int *grado, int *es_completo) {
    int i;
    double coef;

    printf("Ingrese el grado del polinomio: ");
    /* 'grado' ya es un puntero (int *), ya contiene una dirección -> va sin '&' */
    scanf("%d", grado);

    *es_completo = 1;

    if (*grado >= 0) {
        i = 0;
        while (i <= *grado) {
            printf("Ingrese el coeficiente del termino de grado %d: ", i);
            /*
             * %lf = "long float" (double, 8 bytes). En scanf es obligatorio (a
             * diferencia de printf donde float se autopromociona a double); usar %f
             * escribiría solo 4 bytes y corrompería el dato. Lleva '&' porque C pasa
             * por valor y scanf necesita la dirección de memoria para modificar 'coef'.
             */
            scanf("%lf", &coef);

            if (!es_coeficiente_no_cero(coef)) {
                *es_completo = 0;
            }

            i = i + 1;
        }
    } else {
        *es_completo = 0;
    }
}

/*
 * FUNCIÓN es_coeficiente_no_cero
 * Evalúa si el coeficiente real es distinto de cero. Retorna 1 (verdadero) si
 * 'coef != 0.0', o 0 (falso) si es cero, empleando un único punto de retorno.
 */
int es_coeficiente_no_cero(double coef) {
    int resultado = 0;

    if (coef != 0.0) {
        resultado = 1;
    }

    return resultado;
}

/*
 * PROCEDIMIENTO imprimir_veredicto
 * Recibe por valor el grado del polinomio y el estado de la bandera 'es_completo'
 * (1 o 0) e imprime el diagnóstico correspondiente.
 */
void imprimir_veredicto(int grado, int es_completo) {
    if (grado < 0) {
        printf("El grado del polinomio debe ser mayor o igual a 0\n");
    } else if (es_completo) {
        printf("El polinomio de grado %d ES COMPLETO\n", grado);
    } else {
        printf("El polinomio de grado %d NO ES COMPLETO\n", grado);
    }
}
