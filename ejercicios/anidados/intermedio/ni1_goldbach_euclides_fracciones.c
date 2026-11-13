#include <stdio.h>

/* [PARA MAURICIO - PUCP] Goldbach usa búsqueda anidada y corta al hallar la primera terna.
   [NOTA TÉCNICA - JORGE] La suma racional normaliza el resultado mediante MCD/MCM. */
int es_primo(int n);
int mcd(int a,int b);
void simplificar_suma(int *numerador,int *denominador);
void goldbach(int n);
void sumar_fracciones(void);
int abs_i(int n);

int main(void)
{
    int op,n,intentos=0;
    printf("1 Goldbach | 2 Fracciones: ");
    if(scanf("%d",&op)!=1) return 1;
    while((op<1 || op>2) && intentos<3) { printf("Opcion (1-2): "); if(scanf("%d",&op)!=1)return 1; intentos++; }
    if(op<1 || op>2)return 1;
    if(op==1) { if(scanf("%d",&n)!=1 || n<=5 || n%2==0) return 1; goldbach(n); }
    else if(op==2) sumar_fracciones(); else return 1;
    return 0;
}

int es_primo(int n) { int d; if(n<2)return 0; for(d=2;d*d<=n;d++)if(n%d==0)return 0; return 1; }
int abs_i(int n) { return n<0?-n:n; }
int mcd(int a,int b) { int r; a=abs_i(a); b=abs_i(b); while(b){r=a%b;a=b;b=r;} return a; }
void simplificar_suma(int *numerador,int *denominador)
{
    int divisor=mcd(*numerador,*denominador);
    if(divisor==0)divisor=1;
    *numerador/=divisor; *denominador/=divisor;
}

void goldbach(int n)
{
    int p,q,encontrado=0;
    for(p=2;p<n && !encontrado;p++) if(es_primo(p))
        for(q=2;q<n-p && !encontrado;q++) if(es_primo(q) && es_primo(n-p-q)) {
            printf("%d = %d + %d + %d\n",n,p,q,n-p-q); encontrado=1; break;
        }
    if(!encontrado) printf("Sin terna encontrada\n");
}

void sumar_fracciones(void)
{
    int num,den,mcm=1,suma=0,divisor;
    printf("Pares numerador denominador; numerador <= 0 termina\n");
    while(1) {
        if(scanf("%d",&num)!=1) break;
        if(num<=0) break;
        if(scanf("%d",&den)!=1 || den<=0) { printf("Denominador invalido\n"); continue; }
        divisor=mcd(mcm,den); mcm=(mcm/divisor)*den;
        suma=suma+num*(mcm/den);
    }
    simplificar_suma(&suma,&mcm);
    printf("Suma=%d/%d\n",suma,mcm);
}
