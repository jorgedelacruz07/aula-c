#include <stdio.h>

/* [PARA MAURICIO - PUCP] Dos salidas por referencia transmiten éxito y el capicúa hallado.
   [NOTA TÉCNICA - JORGE] Las representaciones en base se mantienen como aritmética decimal. */
int invertirNumero(int num);
void evaluarCapicua(int num,int *lo_logro,int *capicua_hallado);
int convertirBase(int num,int base);
int validarSiEscapicua(int representacion);
void calcularCantidadcapicuasxBase(int ini,int fin);
int es_capicua(int n);

int main(void)
{
    int modo,n,x,mayor=-1,ok,cap;
    printf("1 Juego | 2 Multibase: ");
    if(scanf("%d",&modo)!=1)return 1;
    if(modo==1) {
        if(scanf("%d",&n)!=1 || n<1)return 1;
        while(n-->0) { if(scanf("%d",&x)!=1 || x<0)return 1; evaluarCapicua(x,&ok,&cap); if(ok && cap>mayor)mayor=cap; printf("%d exito=%d capicua=%d\n",x,ok,cap); }
        printf("Mayor=%d\n",mayor);
    } else if(modo==2) { if(scanf("%d%d",&n,&x)!=2 || n<0 || x<n || x>500)return 1; calcularCantidadcapicuasxBase(n,x); }
    else return 1;
    return 0;
}

int invertirNumero(int num) { int inv=0; while(num>0){inv=inv*10+num%10;num/=10;} return inv; }
int es_capicua(int n) { return n==invertirNumero(n); }
void evaluarCapicua(int num,int *lo_logro,int *capicua_hallado)
{
    int intentos=0,inv;
    *lo_logro=0; *capicua_hallado=num;
    while(intentos<10 && !*lo_logro) { if(es_capicua(*capicua_hallado)){*lo_logro=1;break;} inv=invertirNumero(*capicua_hallado); *capicua_hallado+=inv; intentos++; }
    if(es_capicua(*capicua_hallado))*lo_logro=1;
}
int convertirBase(int num,int base) { int val=0,p=1,primera=1; while(num>0||primera) { val+=(num%base)*p; num/=base; p*=10; primera=0; } return val; }
int validarSiEscapicua(int representacion) { return es_capicua(representacion); }
void calcularCantidadcapicuasxBase(int ini,int fin)
{
    int b,n,cantidad;
    for(b=4;b<=9;b++){cantidad=0;for(n=ini;n<=fin;n++)if(validarSiEscapicua(convertirBase(n,b)))cantidad++; printf("Base %d: %d\n",b,cantidad);}
}
