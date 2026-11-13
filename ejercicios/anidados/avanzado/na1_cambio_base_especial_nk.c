#include <stdio.h>

/* [PARA MAURICIO - PUCP] Lee bloques de k cifras en base n para producir dígitos binarios.
   [NOTA TÉCNICA - JORGE] k se obtiene con divisiones sucesivas; no se usa sqrt. */
int contar_cifras(int numero);
int potencia(int base,int exp);
int bloque_a_decimal_binario(int bloque,int n,int k);
void convertir(int numero,int n,int k,int *resultado,int *ancho);
void imprimir_binario(int valor,int ancho);

int main(void)
{
    int numero,n,k,resultado,ancho,intentos=0;
    printf("Numero base n^k, base n [2..9], k: ");
    if(scanf("%d%d%d",&numero,&n,&k)!=3)return 1;
    while((numero<0 || n<2 || n>9 || k<1 || k>5) && intentos<3) { printf("Reingrese numero>=0, n[2..9], k[1..5]: "); if(scanf("%d%d%d",&numero,&n,&k)!=3)return 1; intentos++; }
    if(numero<0 || n<2 || n>9 || k<1 || k>5)return 1;
    convertir(numero,n,k,&resultado,&ancho);
    printf("Binario: "); imprimir_binario(resultado,ancho); printf("\n");
    return 0;
}
int contar_cifras(int numero){int c=0,primera=1;while(numero>0||primera){c++;numero/=10;primera=0;}return c;}
int potencia(int base,int exp){int p=1,i;for(i=0;i<exp;i++)p*=base;return p;}
int bloque_a_decimal_binario(int bloque,int n,int k)
{
    int r=0,p=1,i;
    for(i=0;i<k;i++){r+=(bloque%n)*p;bloque/=n;p*=10;}
    return r;
}
void convertir(int numero,int n,int k,int *resultado,int *ancho)
{
    int cifras=contar_cifras(numero),acumulado=0,i,divisor,digito,parte;
    *ancho=cifras*k;
    for(i=cifras-1;i>=0;i--){divisor=potencia(10,i);digito=(numero/divisor)%10;parte=bloque_a_decimal_binario(digito,n,k);acumulado=acumulado*potencia(10,k)+parte;}
    *resultado=acumulado;
}
void imprimir_binario(int valor,int ancho){(void)ancho;printf("%d",valor);}
