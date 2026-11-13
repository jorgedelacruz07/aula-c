#include <stdio.h>

/* [PARA MAURICIO - PUCP] Tres problemas de recorridos con ciclos anidados y banderas.
   [NOTA TÉCNICA - JORGE] El alcance acota las operaciones de Mersenne para usar int. */
int es_primo(int n);
int es_armstrong(int n);
void gemelos(int a, int b);
void frecuencias(int a, int b, int s);
void mersenne(int max_n);

int main(void)
{
    int op, a, b, s;
    printf("1 Gemelos | 2 Subrangos | 3 Mersenne: ");
    if (scanf("%d", &op) != 1) return 1;
    if (op == 1) { if (scanf("%d%d", &a, &b) != 2 || a < 2 || b < a) return 1; gemelos(a,b); }
    else if (op == 2) { if (scanf("%d%d%d", &a,&b,&s) != 3 || a < 0 || b < a || b > 1000000 || s < 1) return 1; frecuencias(a,b,s); }
    else if (op == 3) { if (scanf("%d", &a) != 1 || a < 1 || a > 30) return 1; mersenne(a); }
    else return 1;
    return 0;
}

int es_primo(int n)
{
    int d;
    if (n < 2) return 0;
    for (d = 2; d * d <= n; d++) if (n % d == 0) return 0;
    return 1;
}

int es_armstrong(int n)
{
    int x=n, dig=0, copia=n, p=1, suma=0, i, d;
    while (copia > 0) { dig++; copia /= 10; }
    if (n == 0) dig = 1;
    while (x > 0) {
        d=x%10; x/=10; p=1;
        for(i=0;i<dig;i++) p*=d;
        suma+=p;
    }
    return suma == n;
}

void gemelos(int a, int b)
{
    int n, ultimo=-1;
    for(n=a;n<=b;n++) if(es_primo(n)) { if(ultimo>=0 && n-ultimo==2) printf("(%d,%d)\n",ultimo,n); ultimo=n; }
}

void frecuencias(int a, int b, int s)
{
    int ini, fin, n, cp=0, ca=0;
    for(ini=a;ini<=b;ini=fin+1) {
        fin=ini+s-1; if(fin>b) fin=b; cp=ca=0;
        for(n=ini;n<=fin;n++) { cp+=es_primo(n); ca+=es_armstrong(n); }
        printf("[%d,%d] primos=%d armstrong=%d\n",ini,fin,cp,ca);
    }
}

void mersenne(int max_n)
{
    int n, v=0;
    for(n=1;n<=max_n;n++) { v=v*2+1; printf("M_%d=%d primo=%s\n",n,v,es_primo(v)?"si":"no"); }
}
