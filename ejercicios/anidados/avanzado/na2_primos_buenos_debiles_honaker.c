#include <stdio.h>

/* [PARA MAURICIO - PUCP] Primos buenos, débiles y Honaker reúnen ciclos anidados.
   [NOTA TÉCNICA - JORGE] Límites de entrada evitan desbordar potencias y productos int. */
int es_primo(int n);
int potencia10(int exp);
int suma_digitos(int n);
int es_debil(int n);
void evaluar_honaker(int n,int *posicion,int *honaker);
int es_woodall(int n);
void buenos(int a,int b);
void debiles(int a,int b);
void honaker_woodall(int a,int b);

int main(void)
{
    int op,a,b,intentos=0;
    printf("1 Buenos | 2 Debiles | 3 Honaker/Woodall: ");
    if(scanf("%d%d%d",&op,&a,&b)!=3)return 1;
    while((op<1 || op>3 || a<1 || b<a || b>30000) && intentos<3) { printf("Opcion/rango invalido; repita: "); if(scanf("%d%d%d",&op,&a,&b)!=3)return 1; intentos++; }
    if(op<1 || op>3 || a<1 || b<a || b>30000)return 1;
    if(op==1)buenos(a,b);else if(op==2)debiles(a,b);else if(op==3)honaker_woodall(a,b);else return 1;
    return 0;
}
int es_primo(int n){int d;if(n<2)return 0;for(d=2;d*d<=n;d++)if(n%d==0)return 0;return 1;}
int potencia10(int e){int p=1,i;for(i=0;i<e;i++)p*=10;return p;}
int suma_digitos(int n){int s=0;while(n){s+=n%10;n/=10;}return s;}
void buenos(int a,int b)
{
    int n,left,right,i,j,rank=0,ok;
    for(n=a;n<=b;n++)if(es_primo(n)){
        rank++; left=n; ok=1;
        for(i=1;i<rank && ok;i++){
            j=0; while(left>1 && j<i) { left--; if(es_primo(left))j++; }
            right=n; j=0; while(j<i) { right++; if(es_primo(right))j++; }
            if(left<=1 || n*n<=left*right)ok=0;
        }
        if(ok)printf("%d ",n);
    }
    printf("\n");
}
int es_debil(int n)
{
    int copia=n,d=0,pos,pot,nuevo,candidato;
    while(copia){d++;copia/=10;} if(d<2||d>9)return 0;
    for(pos=0;pos<d;pos++){pot=potencia10(pos);for(nuevo=0;nuevo<=9;nuevo++){candidato=n-(n/pot%10)*pot+nuevo*pot;if(candidato!=n&&es_primo(candidato))return 0;}}
    return 1;
}
void debiles(int a,int b){int n;for(n=a;n<=b;n++)if(es_debil(n))printf("%d ",n);printf("\n");}
void evaluar_honaker(int n,int *posicion,int *honaker)
{
    int x,conteo=0;
    for(x=2;x<=n;x++)if(es_primo(x))conteo++;
    *posicion=conteo;*honaker=es_primo(n)&&suma_digitos(n)==suma_digitos(conteo);
}
void honaker_woodall(int a,int b)
{
    int n,pos,hon;
    for(n=a;n<=b;n++)if(es_primo(n)){evaluar_honaker(n,&pos,&hon);
        if(hon||es_woodall(n))printf("%d posicion=%d Honaker=%d Woodall=%d\n",n,pos,hon,es_woodall(n));}
}
int es_woodall(int n)
{
    int k,pot=1,valor;
    for(k=1;k<20;k++){pot*=2;valor=k*pot-1;if(valor==n)return 1;if(valor>n)return 0;}
    return 0;
}
