#include <stdio.h>

/* [PARA MAURICIO - PUCP] Practica divisores propios, criterios primos y centinelas.
   [NOTA TÉCNICA - JORGE] evaluarIntocable entrega dos resultados por referencia. */
int evaluarSiEsPrimo(int n);
int evaluarSiEsPoderoso(int n);
int calcularSumaDivisoresPropios(int n);
void evaluarIntocable(int n,int *es_intocable,int *representado_por);
void sociables(void);
void listar(int modo,int a,int b);

int main(void)
{
    int modo,a,b,intentos=0;
    printf("1 Poderosos | 2 Intocables | 3 Sociables: ");
    if(scanf("%d",&modo)!=1)return 1;
    while((modo<1 || modo>3) && intentos<3) { printf("Opcion (1-3): "); if(scanf("%d",&modo)!=1)return 1; intentos++; }
    if(modo<1 || modo>3)return 1;
    if(modo==3)sociables();
    else if((modo==1||modo==2) && scanf("%d%d",&a,&b)==2 && a>=1 && b>=a && b<=100)listar(modo,a,b);
    else return 1;
    return 0;
}
int evaluarSiEsPrimo(int n){int d;if(n<2)return 0;for(d=2;d*d<=n;d++)if(n%d==0)return 0;return 1;}
int evaluarSiEsPoderoso(int n)
{
    int p,q;
    for(p=2;p<=n;p++) if(evaluarSiEsPrimo(p) && n%p==0){q=p*p;if(n%q!=0)return 0;}
    return 1;
}
int calcularSumaDivisoresPropios(int n){int d,s=0,par;for(d=1;d*d<=n;d++)if(n%d==0){par=n/d;if(d<n)s+=d;if(par!=d&&par<n)s+=par;}return s;}
void evaluarIntocable(int n,int *es_intocable,int *representado_por)
{
    int x;
    *es_intocable=1;*representado_por=0;
    for(x=1;x<=n*n && *es_intocable;x++)if(calcularSumaDivisoresPropios(x)==n){*es_intocable=0;*representado_por=x;}
}
void listar(int modo,int a,int b)
{
    int n,ok,rep;
    for(n=a;n<=b;n++){if(modo==1){ok=evaluarSiEsPoderoso(n);if(ok)printf("%d ",n);}else{evaluarIntocable(n,&ok,&rep);if(ok)printf("%d ",n);}}
    printf("\n");
}
void sociables(void)
{
    int n,siguiente,entrada;
    printf("Numeros (0 termina):\n");
    while(1){if(scanf("%d",&entrada)!=1)break;if(entrada==0)break;if(entrada<0){printf("Reintente\n");continue;}
        n=entrada;siguiente=calcularSumaDivisoresPropios(n);printf("%d -> %d\n",n,siguiente);}
}
