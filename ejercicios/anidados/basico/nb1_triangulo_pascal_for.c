#include <stdio.h>

/* [PARA MAURICIO - PUCP] Pascal se construye fila por fila; cada coeficiente es C(p,r).
   [NOTA TÉCNICA - JORGE] El factorial compartido se calcula en un único recorrido. */
void imprime_triangulo_de_pascal(int total_filas);
void imprime_fila(int p);
int combinatorio(int p, int r);

int main(void)
{
    int filas;
    printf("Filas: ");
    if (scanf("%d", &filas) != 1 || filas < 1 || filas > 12) return 1;
    imprime_triangulo_de_pascal(filas);
    return 0;
}

void imprime_triangulo_de_pascal(int total_filas)
{
    int fila;
    for (fila = 0; fila < total_filas; fila++) imprime_fila(fila);
}

void imprime_fila(int p)
{
    int r;
    for (r = 0; r <= p; r++) printf("%d ", combinatorio(p, r));
    printf("\n");
}

int combinatorio(int p, int r)
{
    int cont_fact, fact_p, fact_r, fact_p_menos_r;
    fact_p = fact_r = fact_p_menos_r = 1;
    for (cont_fact = 1; cont_fact <= p; cont_fact++) {
        fact_p *= cont_fact;
        if (cont_fact <= r) fact_r *= cont_fact;
        if (cont_fact <= (p - r)) fact_p_menos_r *= cont_fact;
    }
    return fact_p / (fact_r * fact_p_menos_r);
}
