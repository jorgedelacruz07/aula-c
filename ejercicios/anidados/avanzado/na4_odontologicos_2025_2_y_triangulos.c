#include <stdio.h>

/* [PARA MAURICIO - PUCP] Conteo de cifras obligatorio iterativo; modo 3 dibuja figuras.
   [NOTA TÉCNICA - JORGE] Los divisores excluyen 1 y n; las clasificaciones usan enteros. */
int es_primo(int n);
int cifras(int n);
int cuenta_divisores_internos(int n);
void contar_dientes_y_divisores(int n,int modo,int *dientes,int *divisores);
int evaluar_odontologico(int n,int modo);
int suma_pareja_prima(int n,int trio);
void analizar_rango(int a,int b,int modo);
void triangulo(int tipo,int alto);
void menu_figuras(int alto);

int main(void)
{
    int modo,a,b,intentos=0;
    printf("1 Odontologico | 2 Odonto-energetico | 3 Triangulos: ");
    if(scanf("%d",&modo)!=1)return 1;
    while((modo<1 || modo>3) && intentos<3) { printf("Opcion (1-3): "); if(scanf("%d",&modo)!=1)return 1; intentos++; }
    if(modo<1 || modo>3)return 1;
    if(modo==3){if(scanf("%d",&a)!=1||a<1||a>30)return 1;menu_figuras(a);}
    else if((modo==1||modo==2)&&scanf("%d%d",&a,&b)==2&&a>=1&&b>=a&&b<=100000)analizar_rango(a,b,modo);
    else return 1;
    return 0;
}
int es_primo(int n){int d;if(n<2)return 0;for(d=2;d*d<=n;d++)if(n%d==0)return 0;return 1;}
int cifras(int n){int c=0,primera=1;while(n!=0||primera){c++;n/=10;primera=0;}return c;}
int cuenta_divisores_internos(int n){int d,c=0;for(d=2;d*d<=n;d++)if(n%d==0){c++;if(d!=n/d)c++;}return c;}
void contar_dientes_y_divisores(int n,int modo,int *dientes,int *divisores)
{
    int x=n,d;
    *dientes=0;
    while(x>0){d=x%10;if(modo==1){if(!(d==2||d==3||d==5||d==7))(*dientes)++;}else if(d==4||d==6||d==8||d==9)(*dientes)++;x/=10;}
    *divisores=cuenta_divisores_internos(n);
}
int suma_pareja_prima(int n,int trio)
{
    int total=cifras(n),pot=1,i,suma;
    for(i=0;i<total-(trio?2:1);i++){
        suma=(n/pot)%10+(n/(pot*10))%10;
        if(trio)suma+=(n/(pot*100))%10;
        if(es_primo(suma))return 1;
        pot*=10;
    }
    return 0;
}
int evaluar_odontologico(int n,int modo)
{
    int x=n,d,dientes=0,neutros=0,divisores;
    int par_ok,trio_ok,dig=cifras(n);
    while(x>0){
        d=x%10;
        if(modo==2 && (d==0||d==1))neutros++;
        x/=10;
    }
    if(dig< (modo==1?2:3))return 0;
    par_ok=suma_pareja_prima(n,0);
    trio_ok=suma_pareja_prima(n,1);
    contar_dientes_y_divisores(n,modo,&dientes,&divisores);
    if(modo==1)return par_ok && divisores==dientes;
    return neutros==0 && trio_ok && divisores==dientes;
}
void analizar_rango(int a,int b,int modo){int n;for(n=a;n<=b;n++)if(evaluar_odontologico(n,modo))printf("%d ",n);printf("\n");}
void triangulo(int tipo,int alto)
{
    int f,c,esp;
    for(f=1;f<=alto;f++){for(esp=0;esp<alto-f;esp++)printf(" ");for(c=1;c<=alto;c++){if(tipo==0?(f==1||f==alto||c==(alto+1)/2):tipo==1?(c==1||c==alto||f==1||f==alto):tipo==2?(c==1||c==alto||f==(alto+1)/2):tipo==3?(c==f||c==alto-f+1||f==(alto+1)/2):c==1||f==alto)printf("*");else printf(" ");}printf("\n");}
}
void menu_figuras(int alto){int t,exitosas=0,fallidas=0;for(t=0;t<5;t++){if(alto<2){printf("Figura %c: fallo, altura minima 2\n",t==0?'I':t==1?'D':t==2?'H':t==3?'A':'L');fallidas++;}else{printf("Figura %c\n",t==0?'I':t==1?'D':t==2?'H':t==3?'A':'L');triangulo(t,alto);exitosas++;}}printf("Exitosas=%d Fallidas=%d\n",exitosas,fallidas);}
