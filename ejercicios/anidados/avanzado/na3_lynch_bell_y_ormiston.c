#include <stdio.h>

/* [PARA MAURICIO - PUCP] Recorre dígitos aritméticamente sin arreglos ni cadenas.
   [NOTA TÉCNICA - JORGE] Ormiston compara frecuencias escalares para cada dígito 0..9. */
int es_primo(int n);
int potencia10(int e);
int es_lynch_bell(int n);
int frecuencia(int n,int digito);
void suma_producto_digitos(int n,int *suma,int *producto);
int son_ormiston(int a,int b);
void lynch(int a,int b);
void ormiston(int a,int b);

int main(void)
{
    int op,a,b,intentos=0;
    printf("1 Lynch-Bell | 2 Ormiston: ");
    if(scanf("%d%d%d",&op,&a,&b)!=3)return 1;
    while((op<1 || op>2 || a<1 || b<a || b>1000000) && intentos<3) { printf("Opcion/rango invalido; repita: "); if(scanf("%d%d%d",&op,&a,&b)!=3)return 1; intentos++; }
    if(op<1 || op>2 || a<1 || b<a || b>1000000)return 1;
    if(op==1)lynch(a,b);else if(op==2)ormiston(a,b);else return 1;
    return 0;
}
int es_primo(int n){int d;if(n<2)return 0;for(d=2;d*d<=n;d++)if(n%d==0)return 0;return 1;}
int potencia10(int e){int p=1,i;for(i=0;i<e;i++)p*=10;return p;}
int es_lynch_bell(int n)
{
    int copia=n,d,valid=1;
    while(copia){d=copia%10;if(d==0||n%d!=0)return 0;copia/=10;}
    for(d=0;d<10;d++)if(frecuencia(n,d)>1)valid=0;
    return valid;
}
int frecuencia(int n,int digito){int c=0;if(n==0)return digito==0;while(n){if(n%10==digito)c++;n/=10;}return c;}
void suma_producto_digitos(int n,int *suma,int *producto){int d;*suma=0;*producto=1;while(n){d=n%10;*suma+=d;*producto*=d;n/=10;}}
int son_ormiston(int a,int b)
{
    int d,sa,pa,sb,pb;
    if(!es_primo(a)||!es_primo(b)||a==b)return 0;
    suma_producto_digitos(a,&sa,&pa);suma_producto_digitos(b,&sb,&pb);
    if(sa!=sb||pa!=pb)return 0;
    for(d=0;d<10;d++)if(frecuencia(a,d)!=frecuencia(b,d))return 0;
    return 1;
}
void lynch(int a,int b){int n;for(n=a;n<=b;n++)if(es_lynch_bell(n))printf("%d ",n);printf("\n");}
void ormiston(int a,int b)
{
    int n,next,cuenta=0;
    for(n=a;n<b;n++)if(es_primo(n)){next=n+1;while(next<=b&&!es_primo(next))next++;if(next<=b&&son_ormiston(n,next)){printf("%d %d\n",n,next);cuenta++;}}
    printf("Pares=%d\n",cuenta);
}
