# Guía de Estudio · Programación Modular e Iterativa en C (1INF01 PUCP)

**Tema:** Programación modular combinada con estructuras iterativas y selectivas, en ANSI C.
**Verificación inicial:** `make clean && make test && make reglas` debe terminar en *"Todos los casos pasan"* y *"Todos los archivos cumplen las reglas del curso"*.

---

## 0. Equivalencias: de C general a las reglas estrictas de 1INF01

| Construcción general en C | Lo que exige 1INF01 | Por qué importa en la calificación |
|---|---|---|
| `for (i = 0; i < n; i++)` | `i = 0; while (i < n) { ...; i = i + 1; }` | `for` invalida la pregunta |
| `break` / `return` dentro del loop | bandera en la condición: `while (i <= n && !encontrado)` | `break`/`continue` prohibidos; un solo punto de salida |
| `switch (op)` | cadena `if / else if / else` | `switch` prohibido |
| devolver tupla/struct | procedimiento `void` con *out params* (`double *p1, double *p2`) | `struct` prohibido |
| `bool ok = true;` | `int ok = 1;` | `<stdbool.h>` prohibido |
| `float` | `double` + `%lf` (en `scanf` **y** en `printf`) | `float` penaliza |
| `strlen(itoa(n))`, `while (n) { n /= 10; c++; }` | `(int)log10(n) + 1` validando antes `n > 0` | contar cifras con bucle está prohibido |
| arreglo de los últimos k términos | variables deslizantes `a, b, c` | arreglos prohibidos |
| early return de validación | `int resultado = 0; ... return resultado;` | estilo estructurado (un `return`) |
| `if` anidado | `if / else if` plano, o **delegar** el segundo `if` a otro módulo | en algunos laboratorios, anidar = penalización |

**Regla de diseño modular:** "`main` es el coordinador: no calcula en bucles, solo invoca módulos y decide con `if` qué flujo seguir".

---

## 1. Orden de estudio de los 5 patrones troncales

| # | Bloque | Archivo | Conceptos de C a dominar |
|---|---|---|---|
| 0 | Plantilla de 3 zonas | cualquiera | Zona 1 includes + prototipos con `;`, Zona 2 `int main()`, Zona 3 definiciones. Función (retorna) vs procedimiento (`void`). |
| 1 | Funciones puras + `while` por contador | **Ej5** Riemann | Funciones que retornan `double`; un solo `while`; `x_i = a + i*dx`; `fabs` con tolerancia; **delegar para no anidar**. |
| 2 | Paso por referencia en la lectura | **Ej1** (`leer`) | `&` al llamar, `*` en el parámetro, `scanf` **sin** `&` dentro de `leer`, `" %c"`. Pila de llamadas (sección 2). |
| 3 | Descomposición de dígitos + banderas | **Ej1** (`procesar`) | `% 10`, `/ 10`, copia del número, bandera en vez de `break`, `log10` para validar. |
| 4 | Lotes y contadores por referencia | **Ej3** | Contadores en 0, reenviar punteros **sin** `&`, `*c = *c + 1` vs `*c++`, `(double)` en porcentajes, `%%`. |
| 5 | Recurrencias y sumatorias | **Ej2** | Variables deslizantes (orden de asignación), factorial `double`, procedimiento con 2 *out params*. |
| 6 | Reconstrucción posicional | **Ej4** | Rotar con `pow(10, d-1)` sobre `*num`; suma en base b con acarreo y `factor`. |

---

## 2. La pila de llamadas: paso por valor vs paso por referencia

### 2.1 Paso POR VALOR: el módulo recibe una copia

```c
void duplicar_mal(int x) { x = x * 2; }      /* modifica SU copia */

int main() {
    int n = 5;
    duplicar_mal(n);                          /* n sigue valiendo 5 */
}
```

```
  Durante la llamada                         Después del return
  ┌───────────────────────────────┐
  │ duplicar_mal                  │          (el frame desaparece,
  │   x : 5 -> 10   @0x16fdff6cc  │  ──X──►   y con él la copia x)
  └───────────────────────────────┘
  ┌───────────────────────────────┐          ┌───────────────────────────────┐
  │ main                          │          │ main                          │
  │   n : 5         @0x16fdff6ec  │          │   n : 5   ← NO cambió         │
  └───────────────────────────────┘          └───────────────────────────────┘
        x es OTRA celda de memoria: lo que pase con x no toca a n.
```

### 2.2 Paso POR REFERENCIA (mediante punteros): el módulo recibe la dirección

```c
void leer(int *num, int *cant_dig, char *op) {
    scanf("%d %d", num, cant_dig);            /* SIN &: num YA es una dirección */
    scanf(" %c", op);
}

int main() {
    int numero, cant_digitos;  char operador;
    leer(&numero, &cant_digitos, &operador);  /* CON &: se envía la dirección */
}
```

```
  ┌──────────────────────────────────────────────┐
  │ leer                                         │
  │   num      : 0x16fdff6ec ────────────┐       │   num guarda una DIRECCIÓN
  │   cant_dig : 0x16fdff6e8 ──────────┐ │       │
  │   op       : 0x16fdff6e7 ────────┐ │ │       │   *num = ...  escribe EN main
  └──────────────────────────────────┼─┼─┼───────┘
  ┌──────────────────────────────────┼─┼─┼───────┐
  │ main                             │ │ ▼       │
  │   numero       : 97531  @0x16fdff6ec ◄─ scanf escribe aquí
  │   cant_digitos : 5      @0x16fdff6e8 ◄─┘     │
  │   operador     : '+'    @0x16fdff6e7 ◄─┘     │
  └──────────────────────────────────────────────┘

   &numero  -> "¿DÓNDE vive numero?"        (en main, al llamar)
   *num     -> "lo que hay EN esa dirección" (en leer, al usar el valor)
   num      -> la dirección misma            (lo que se le pasa a scanf)
```

### 2.3 Reenviar un puntero a otro módulo (Ej3 y Ej4): **sin `&`**

```
  main                    procesar_mediciones          clasificar_iluminancia
  ┌──────────────────┐    ┌──────────────────────┐     ┌──────────────────────────┐
  │ cant_ocaso : 0   │◄───│ cant_ocaso: 0x...6e0 │────►│ cant_ocaso: 0x...6e0     │
  │   @0x...6e0      │    │ (int *)              │     │ *cant_ocaso =            │
  └──────────────────┘    └──────────────────────┘     │     *cant_ocaso + 1;     │
        ▲                                               └────────────┬─────────────┘
        └────────────────── escribe directamente en main ────────────┘

  main:                 procesar_mediciones(n, &cant_ocaso, ...);   ← & (es variable)
  procesar_mediciones:  clasificar_iluminancia(lux, cant_ocaso, ...); ← SIN & (ya es puntero)
```

Si en `procesar_mediciones` se escribiera `&cant_ocaso`, se enviaría la dirección **del puntero** (`int **`): `clang` advierte *incompatible pointer types* y el programa escribe en una dirección incorrecta.

### 2.4 ¿Función o procedimiento? Regla práctica

| Necesito devolver… | Uso | Ejemplo |
|---|---|---|
| nada (leer, imprimir) | procedimiento `void` | `void imprimir_reporte(int n, ...)` |
| **1** valor | función con `return` | `double factorial(int k)` |
| **2 o más** valores | procedimiento `void` con punteros | `void calcular_terminos(..., double *p1, double *p2)` |
| modificar una variable del caller | procedimiento `void` con puntero | `void rotar_numero(int *num, char s)` |

---

## 3. Errores frecuentes en C y su forma correcta

| # | Código con error | Qué pasa realmente | Correcto |
|---|---|---|---|
| 1 | `if (a = 5)` | **asigna** 5 a `a`; la condición siempre es verdadera | `if (a == 5)` |
| 2 | `if (a == b == c)` | evalúa `(a == b)` → 0 o 1, y compara **eso** con `c` | `if (a == b && b == c)` |
| 3 | `if (0 < x < 10)` | `(0 < x)` da 0/1, que siempre es `< 10` → siempre verdadero | `if (x > 0 && x < 10)` |
| 4 | `suma = suma + 1 / factorial;` (con `int`) | división **entera**: `1 / 6 = 0` | `1.0 / factorial` |
| 5 | `porc = cant / n * 100;` | `1 / 4 = 0` → 0 % | `(double)cant / n * 100` |
| 6 | `int fact = 1;` | 13! = 6 227 020 800 > 2 147 483 647: overflow, sale basura | `double fact = 1;` |
| 7 | `scanf("%d", &num);` dentro de `void leer(int *num)` | pasa `int **`: scanf escribe sobre el puntero | `scanf("%d", num);` |
| 8 | `scanf("%d", num);` en `main` con `int num;` | pasa el **valor** basura como dirección → crash | `scanf("%d", &num);` |
| 9 | `scanf("%c", &op);` tras leer un número | lee el `'\n'` que quedó en el buffer | `scanf(" %c", &op);` |
| 10 | `scanf("%f", &x);` con `double x` | `%f` escribe un `float` (4 bytes) en un `double` (8) | `scanf("%lf", &x);` |
| 11 | `*cont++;` | `++` va primero: avanza el **puntero**; el contador no cambia | `*cont = *cont + 1;` |
| 12 | `if (x == 0.3)` con `double` | 0.1 + 0.2 = 0.30000000000000004 → falso | `if (fabs(x - 0.3) < 0.0001)` |
| 13 | `abs(x - y)` con `double` | `abs` es para `int`: trunca | `fabs(x - y)` |
| 14 | `(int)log10(num) + 1` sin validar | `log10(0)` = −∞ → valor absurdo | primero `num > 0` |
| 15 | `while (i <= n);` | el `;` es el cuerpo vacío → bucle infinito | sin `;` |
| 16 | olvidar `i = i + 1;` | bucle infinito | actualizar el contador al final |
| 17 | `suma`, contadores sin inicializar | arrancan con basura | `= 0` antes del `while` |
| 18 | prototipo y definición con distinto tipo | error de compilación o conversión silenciosa | copiar y pegar la cabecera |
| 19 | olvidar el prototipo | "implicit declaration of function" | prototipo en Zona 1 |
| 20 | `(int)pow(10, 2)` | puede dar 99 con libm imprecisas | `(int)(pow(10, 2) + 0.5)` |
| 21 | deslizar en el orden equivocado: `b = c; a = b;` | `a` recibe el `c` nuevo: se pierde un término | `a = b; b = c; c = nuevo;` |
| 22 | modificar `num` en `procesar` y luego imprimirlo | ya vale 0 | trabajar con `copia = num` |
| 23 | `while` dentro de `while` / `if` dentro de `if` (si el lab lo prohíbe) | penalización | `if/else if` plano o mover el interno a otro módulo |

---

## 4. Casos de prueba del Bloque Original (`ej1` a `ej5`)

Formas de ejecutarlos:

```sh
make ej1                                              # y pegar la entrada a mano
./build/ej1_secuencia_digitos < pruebas/ej1_caso1_suma.in   # caso guardado
printf '97531 5\n+\n' | ./build/ej1_secuencia_digitos       # en una línea
make test                                             # los 30 casos con diff automático
```

### Ej1 · Secuencia de dígitos (`make ej1`)

| Entrada | Resultado esperado |
|---|---|
| `97531 5` y `+` | `Los digitos del numero 97531 tienen una secuencia de +2` |
| `345678 6` y `-` | `Los digitos del numero 345678 tienen una secuencia de -1` |
| `842 3` y `*` | `Los digitos del numero 842 tienen una secuencia de *2` |
| `139 3` y `/` | `Los digitos del numero 139 tienen una secuencia de /3` |
| `12345 5` y `+` | `Los digitos del numero 12345 no tienen una secuencia de +` |
| `9630 4` y `+` | `Los digitos del numero 9630 tienen una secuencia de +3` |
| `1234 3` y `+` | `Datos incorrectos` |

### Ej2 · Sucesiones y sumatorias (`make ej2`)

| Entrada | Resultado esperado |
|---|---|
| `Z` y `2` | `El numero 2 SI pertenece a los 15 primeros terminos de Z` |
| `z` y `7` | `El numero 7 NO pertenece a los 15 primeros terminos de Z` |
| `Z` y `1500` | `El numero debe estar en el rango [0, 1000]` |
| `S`, `1` y `2` | `El resultado de la sumatoria es: 552.0000` |
| `s`, `0` y `3` | `El resultado de la sumatoria es: 3.0000` |
| `S`, `0.5` y `4` | `El resultado de la sumatoria es: 741750.7083` |
| `S`, `2.5` y `3` | `Datos fuera de rango: a debe estar en [0, 2] y n en [0, 10]` |
| `X` | `Opcion invalida` |

Comprobación manual de `a = 1, n = 2`:

| i | (3a)^i | (2i+1)! | parte1 = (3a)^i·(2i+1)!/(3−a) | parte2 = 1/i! | término |
|---|---|---|---|---|---|
| 0 | 1 | 1 | 0.5 | 1 | 1.5 |
| 1 | 3 | 6 | 9 | 1 | 10 |
| 2 | 9 | 120 | 540 | 0.5 | 540.5 |
| | | | | **Total** | **552** |

### Ej3 · Lote de iluminancias (`make ej3`)

**Caso 1:** un nivel de cada tipo

```
4
I
50000 L
i
150 h
F
25000 5
I
400 L
```

Resultado esperado:

```
  -> 50000.00 lux: Luz solar directa BRILLANTE
  -> 15000.00 lux: Luz diurna de CIELO AZUL
  -> 5000.00 lux: Dia NUBLADO
  -> 400.00 lux: OCASO

========== REPORTE FINAL ==========
Total de mediciones     : 4
Brillante (sol directo) : 1 (25.00%)
Cielo azul              : 1 (25.00%)
Nublado                 : 1 (25.00%)
Ocaso                   : 1 (25.00%)
Mediciones invalidas    : 0
```

**Caso 2:** área 0, tipo inválido y hectolux

```
3
F
1000 0
X
I
2 H
```

Resultado esperado:

```
  -> Medicion invalida: no se clasifica
  -> Medicion invalida: no se clasifica
  -> 200.00 lux: OCASO

========== REPORTE FINAL ==========
Total de mediciones     : 3
Brillante (sol directo) : 0 (0.00%)
Cielo azul              : 0 (0.00%)
Nublado                 : 0 (0.00%)
Ocaso                   : 1 (33.33%)
Mediciones invalidas    : 2
```

**Caso 3:** `0` → `La cantidad de mediciones debe ser mayor que 0`

### Ej4 · Rotación y bases (`make ej4`)

| Entrada | Resultado esperado |
|---|---|
| `1`, `12345 2`, `D` | `Numero tras 2 rotacion(es) en sentido D: 45123` |
| `1`, `12345 7`, `i` | `Numero tras 7 rotacion(es) en sentido i: 34512` |
| `1`, `987654321 1`, `D` | `Numero tras 1 rotacion(es) en sentido D: 198765432` |
| `1`, `1230 1`, `D` | `Datos incorrectos` (contiene un 0) |
| `2`, `2`, `101 11` | `(101)_2 + (11)_2 = (1000)_2` |
| `2`, `5`, `234 43` | `(234)_5 + (43)_5 = (332)_5` |
| `2`, `7`, `123 456` | `(123)_7 + (456)_7 = (612)_7` |
| `2`, `8`, `777 1` | `(777)_8 + (1)_8 = (1000)_8` |
| `2`, `2`, `102 1` | `Datos incorrectos` (el 2 no existe en base 2) |
| `3` | `Opcion invalida` |

### Ej5 · Riemann (`make ej5`)

| Entrada (k, luego a b) | Resultado esperado |
|---|---|
| `200` y `0 0.5` | `Trabajo aproximado (Riemann): 24.9995 J` · `Trabajo exacto (integral)   : 25.0000 J` · `La aproximacion coincide con el valor exacto (tolerancia 0.01 J)` |
| `50` y `0.1 0.3` | `Trabajo aproximado (Riemann): 1.9999 J` · `Trabajo exacto (integral)   : 2.0000 J` · `La aproximacion coincide...` |
| `100` y `0.4 0.2` | `Datos incorrectos: se requiere k > 0 y 0 <= a < b` |

---

## 5. Variantes de práctica propuestas

1. **Ej1:** Imprimir además cuántos pasos se verificaron (contador por referencia).
2. **Ej2:** Cambiar a $Z(0)=1, Z(1)=1, Z(2)=2, Z(n)=Z(n−1)+Z(n−3)$ y verificar los 20 primeros términos.
3. **Ej3:** Agregar el promedio de lux de las mediciones válidas (acumulador `double` por referencia + cast).
4. **Ej4:** Invertir un número (`1234` → `4321`) sobrescribiendo la variable con `void invertir(int *num)`.
5. **Ej5:** Calcular la suma con el **punto medio** `x_i = a + (i + 0.5)·dx` y comparar el error con la suma izquierda.

---

## 6. Lista de verificación antes de entregar un laboratorio

- [ ] Solo `#include <stdio.h>`, `<math.h>`, `<stdlib.h>`.
- [ ] Todos los prototipos arriba de `main`, con `;` y los mismos tipos que la definición.
- [ ] `main` solo coordina: lee, valida, llama, decide.
- [ ] Ningún `for`, `do`, `switch`, `break`, `continue`, arreglo, `float`, `bool`.
- [ ] Cada `while` tiene contador/condición inicializado **antes** y actualizado **dentro**.
- [ ] Acumuladores y contadores en 0 antes del `while`; factoriales en `double` desde 1.
- [ ] En `scanf`: `&` para variables locales, **sin** `&` para parámetros puntero; `%lf` para `double`; `" %c"` para `char`.
- [ ] Divisiones reales con `1.0` o `(double)`.
- [ ] Reales comparados con `fabs(a - b) < 0.0001`, nunca con `==`.
- [ ] Contar cifras con `(int)log10(n) + 1` (con `n > 0`) o con rangos.
- [ ] Probar con: un caso normal, un caso límite (0, 1, el máximo del rango) y un caso inválido.

---

## 7. Ruta de Entrenamiento por Niveles (Básico -> Intermedio -> Avanzado)

Para ver en consola todos los comandos disponibles por nivel, ejecuta:

```sh
make list
```

Esta ruta complementa los 5 ejercicios troncales con **10 programas autónomos adicionales** de la Guía de Ejercicios y Laboratorios Pasados de **1INF01 (PUCP)**, organizados en tres subcarpetas (`ejercicios/basico/`, `ejercicios/intermedio/` y `ejercicios/avanzado/`).

---

### A. Nivel Básico (`ejercicios/basico/`) — Funciones simples, punteros básicos y `while` directo

#### B1 · Polinomio Completo (`make b1` · Guía PUCP 2.1.1)
- **Archivo:** `ejercicios/basico/b1_polinomio_completo.c`
- **Concepto clave:** Un polinomio de grado $n$ tiene **$n + 1$ términos** (desde el grado $0$ hasta el grado $n$). El bucle `while (i <= *grado)` debe leer **todos** los coeficientes y usar una bandera acumuladora `*es_completo` que cae a `0` si algún coeficiente es `0`.
- **Estructura exacta:** `main` + 3 módulos (`leer_y_evaluar_polinomio`, `es_coeficiente_no_cero`, `imprimir_veredicto`).

| Caso | Entrada (grado y coeficientes $c_0 \dots c_n$) | Resultado esperado |
|---|---|---|
| Polinomio completo ($4 - 2x + 7x^2 + x^3$) | `3` luego `4`, `-2`, `7`, `1` | `El polinomio de grado 3 ES COMPLETO` |
| Polinomio incompleto ($4 + 0x + 7x^2 + x^3$) | `3` luego `4`, `0`, `7`, `1` | `El polinomio de grado 3 NO ES COMPLETO` |
| Polinomio constante no nulo ($P(x) = 5$) | `0` luego `5` | `El polinomio de grado 0 ES COMPLETO` |
| Grado inválido | `-2` | `El grado del polinomio debe ser mayor o igual a 0` |

**Comando rápido de prueba:**
```sh
printf '3\n4\n-2\n7\n1\n' | ./build/b1_polinomio_completo
```

---

#### B2 · MCM (100 primeros múltiplos) y Producto de Wallis (`make b2` · Guía PUCP 2.1.3 y 2.1.9)
- **Archivo:** `ejercicios/basico/b2_mcm_y_pi_wallis.c`
- **Conceptos clave:**
  1. **MCM con bandera sin `break`:** Se identifica el mayor de $A$ y $B$ y se prueban únicamente `mayor * 1`, `mayor * 2`, ..., `mayor * 100` con `while (i <= 100 && !encontrado)`.
  2. **Productoria de Wallis en `double`:** El acumulador multiplicativo debe iniciar en `1.0` (no en `0.0`) y usar `2.0 * n` para evitar división entera:
     $$\frac{\pi}{2} = \prod_{n=1}^{k} \left(\frac{2n}{2n-1} \cdot \frac{2n}{2n+1}\right)$$

| Caso (Parte 1: MCM) | Entrada (`A B`) | Resultado esperado (Parte 1) |
|---|---|---|
| Múltiplo común estándar | `12 18` | `El MCM de 12 y 18 es: 36` |
| Uno es múltiplo del otro | `7 21` | `El MCM de 7 y 21 es: 21` |
| Primos grandes (supera los 100 múltiplos) | `101 103` | `No se encontro el MCM entre los 100 primeros multiplos del mayor` |
| Fuera de rango ($< 2$) | `1 15` | `Datos incorrectos: A y B deben ser mayores o iguales a 2` |

**Resultado fijo de la Parte 2 (Producto de Wallis invocado con 200 y 2000 términos):**
```
Pi aproximado con 200 terminos  : 3.137678
Pi aproximado con 2000 terminos : 3.141200
```

**Comando rápido de prueba:**
```sh
printf '12 18\n' | ./build/b2_mcm_y_pi_wallis
```

---

#### B3 · Tres Números Consecutivos sin Arreglos (`make b3` · Guía PUCP 2.1.7)
- **Archivo:** `ejercicios/basico/b3_tres_consecutivos.c`
- **Concepto clave:** Ventana deslizante de 3 variables (`*n1 = *n2; *n2 = *n3; *n3 = nuevo;`). Para **no reutilizar números de una tríada ya contada**, apenas `son_tres_consecutivos(n1, n2, n3)` devuelve `1`, se imprime la felicitación, se incrementa el contador y se **vacía la ventana** (`n1 = 0; n2 = 0; n3 = 0;`).

| Secuencia dentro de los 20 números | Qué ocurre paso a paso | Veces que felicita |
|---|---|---|
| `3, 4, 5, 6, 7, 1, ...` (resto `1`) | `(3, 4, 5)` felicita y reinicia la ventana a `(0, 0, 0)`; luego entran `6, 7, 1` y no forman tríada. | `1` |
| `3, 4, 5, 6, 7, 8, ...` (resto `1`) | `(3, 4, 5)` felicita y reinicia; luego `(6, 7, 8)` forma una segunda tríada completa. | `2` |
| `3, 4, 5, 1, 10, 11, 12, ...` (resto `1`) | Detecta `(3, 4, 5)` y más adelante `(10, 11, 12)`. | `2` |

**Comando rápido de prueba:**
```sh
printf '3\n4\n5\n6\n7\n1\n10\n11\n12\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n' | ./build/b3_tres_consecutivos
```

---

### B. Nivel Intermedio (`ejercicios/intermedio/`) — Conectar módulos dentro de `while`, menús y geometría

#### I1 · Conjetura de Collatz y Números Catalanes (`make i1` · Guía PUCP 2.2.1 y 2.2.3)
- **Archivo:** `ejercicios/intermedio/i1_collatz_y_catalanes.c`
- **Conceptos clave:**
  - En **Collatz (Opción 1):** `generar_serie_collatz` ejecuta `while (n != 1)` llamando a `siguiente_collatz(n)`, que a su vez llama a `es_par(n)` (cadena de llamadas de 3 niveles).
  - En **Catalanes (Opción 2):** `calcular_catalan(k)` evalúa $C_k = \frac{(2k)!}{(k+1)! \, k!}$ invocando **3 veces** a `calcular_factorial` (en `double`) con argumentos `2 * k`, `k + 1` y `k`.

| Opción | Entrada | Resultado esperado |
|---|---|---|
| `1` (Collatz) | `1` y `6` | `Serie de Collatz: 6 3 10 5 16 8 4 2 1` |
| `1` (Collatz) | `1` y `19` | `Serie de Collatz: 19 58 29 88 44 22 11 34 17 52 26 13 40 20 10 5 16 8 4 2 1` |
| `1` (Collatz caso base) | `1` y `1` | `Serie de Collatz: 1` |
| `2` (Catalanes) | `2` y `6` | `C(0) = 1`, `C(1) = 1`, `C(2) = 2`, `C(3) = 5`, `C(4) = 14`, `C(5) = 42`, `C(6) = 132` |

**Comandos rápidos de prueba:**
```sh
printf '1\n6\n' | ./build/i1_collatz_y_catalanes
printf '2\n6\n' | ./build/i1_collatz_y_catalanes
```

---

#### I2 · Intersección de Intervalos y Rectas en el Plano (`make i2` · Guía PUCP 2.1.5 y 2.2.2)
- **Archivo:** `ejercicios/intermedio/i2_intervalos_y_rectas.c`
- **Conceptos clave:**
  - **Parte 1 (Intervalos):** $[a_1, a_2] \cap [b_1, b_2] = [\max(a_1, b_1), \min(a_2, b_2)]$, que existe sí y solo si `*inter_inf <= *inter_sup`.
  - **Parte 2 (Rectas):** Reutilizar `leer_punto(char nombre_punto, double *x, double *y)` 4 veces con `'P'`, `'Q'`, `'R'`, `'S'`. Comparar paralelismo con `fabs(m1 - m2) < 0.0001` y perpendicularidad con `fabs(m1 * m2 + 1.0) < 0.0001`.

| Caso | Entrada Parte 1 (Intervalos) | Entrada Parte 2 (Puntos P, Q, R, S) | Resultado esperado |
|---|---|---|---|
| Intersección + Perpendiculares | `2 8` y `5 12` | `P(0,0) Q(2,4) R(0,4) S(4,2)` | `[5.00, 8.00]` · `m1 = 2.0000, m2 = -0.5000` · `PERPENDICULARES` |
| Disjuntos + Paralelas | `1 3` y `5 9` | `P(0,1) Q(2,5) R(1,0) S(3,4)` | `NO se intersecan` · `m1 = 2.0000, m2 = 2.0000` · `PARALELAS` |
| Punto único + Secantes oblicuas | `1 5` y `5 8` | `P(0,0) Q(1,1) R(0,2) S(1,5)` | `[5.00, 5.00]` · `m1 = 1.0000, m2 = 3.0000` · `SE CRUZAN` |

**Comando rápido de prueba:**
```sh
printf '2 8\n5 12\n0 0\n2 4\n0 4\n4 2\n' | ./build/i2_intervalos_y_rectas
```

---

#### I3 · Laboratorio 5 (Ciclo 2025-1): Sucesión $B(n)$, Densidad y Presión (`make i3` · Guía PUCP 2.2.9)
- **Archivo:** `ejercicios/intermedio/i3_lab_2025_1_sucesionB.c`
- **Conceptos clave:**
  - Los 20 primeros términos ($n = 0 \dots 19$) de $B(0)=2, B(1)=3, B(n) = B(n-2) + B(n-1) - (n \% 4)$ son:
    `2, 3, 3, 3, 6, 8, 12, 17, 29, 45, 72, 114, 186, 299, 483, 779, 1262, 2040, 3300, 5337`.
  - Diferencia estricta entre intervalo abierto `]` (`>`) y cerrado `]` (`<=`) en las validaciones físicas.

| Opción | Entrada | Resultado esperado |
|---|---|---|
| `B` | `299` ($B(13)$) | `El numero 299 SI pertenece a los 20 primeros terminos de B(n)` |
| `b` | `5337` ($B(19)$, último de los 20) | `El numero 5337 SI pertenece a los 20 primeros terminos de B(n)` |
| `B` | `100` | `El numero 100 NO pertenece a los 20 primeros terminos de B(n)` |
| `D` | `4.5 1.5` | `La densidad es: 3.0000 kg/m^3` |
| `d` | `0 1.5` (masa en `]0, 5]` no admite 0) | `Error: masa debe estar en ]0, 5] y volumen en ]0, 3]` |
| `P` | `500 2.5` | `La presion es: 200.0000 Pa` |
| `p` | `4.9 2.5` (fuerza en `[5, 1000]` no admite 4.9) | `Error: fuerza debe estar en [5, 1000] y area en ]0, 5]` |

**Comando rápido de prueba:**
```sh
printf 'B\n299\n' | ./build/i3_lab_2025_1_sucesionB
```

---

### C. Nivel Avanzado (`ejercicios/avanzado/`) — Múltiples punteros, descomposición y restricciones fuertes

#### A1 · Números Felices e Infelices Primos (`make a1` · Guía PUCP 2.3.1)
- **Archivo:** `ejercicios/avanzado/a1_numeros_felices_primos.c`
- **Conceptos clave:** Implementa exactamente los 5 prototipos pedidos (`leer_datos`, `cant_digitos`, `sum_digits_al_cuadrado`, `es_feliz`, `es_primo`). `es_feliz` evita anidar bucles delegando la suma de cuadrados de dígitos a `sum_digits_al_cuadrado`.

| Entrada | Traza de suma de cuadrados | Resultado esperado |
|---|---|---|
| `19` | $19 \to 82 \to 68 \to 100 \to 1$ (4 iteraciones, y 19 es primo) | `El numero 19 es un NUMERO PRIMO FELIZ` |
| `23` | $23 \to 13 \to 10 \to 1$ (3 iteraciones, y 23 es primo) | `El numero 23 es un NUMERO PRIMO FELIZ` |
| `11` | $11 \to 2 \to 4 \to 16 \to 37 \to 58 \to 89 \to 145 \to 42$ (supera 8 iter., primo) | `El numero 11 es un NUMERO PRIMO INFELIZ` |
| `28` | $28 \to 68 \to 100 \to 1$ (3 iteraciones, compuesto) | `El numero 28 es un NUMERO FELIZ (no es primo)` |
| `15` | Supera 8 iteraciones y es compuesto | `El numero 15 es un NUMERO INFELIZ (no es primo)` |
| `7` | Solo tiene 1 cifra | `Error: el numero ingresado debe ser positivo de exactamente 2 cifras` |

**Comando rápido de prueba:**
```sh
printf '19\n' | ./build/a1_numeros_felices_primos
```

---

#### A2 · Validación de Password Bancario de 6 Cifras (`make a2` · Guía PUCP 2.3.4)
- **Archivo:** `ejercicios/avanzado/a2_validar_password_6_cifras.c`
- **Concepto clave:** En `menor_digito(int password, int *min_digit, int *pos_min_digit)`, al recorrer de derecha (`pos = 6`) a izquierda (`pos = 1`), usar `if (digito <= *min_digit)` garantiza que ante empates del dígito menor se conserve la posición **más a la izquierda**.

| Entrada | Análisis de las 4 reglas | Resultado esperado |
|---|---|---|
| `528924` | 6 cifras, sin ceros, no iguales, menor = `2` en pos `2` y `5` (más a la izq = `2 != 1`) | `Menor digito: 2 (ubicado en la posicion 2 desde la izquierda)` · `Password VALIDO: cumple todas las reglas de seguridad` |
| `252894` | El menor = `2` se repite en pos `1` y `3` -> más a la izquierda es pos `1` | `Menor digito: 2 (ubicado en la posicion 1 desde la izquierda)` · `Password INVALIDO: el menor digito se ubica en la primera posicion de la izquierda` |
| `777777` | Todas las cifras son iguales | `Password INVALIDO: no todas las cifras pueden ser iguales` |
| `520894` | Contiene un cero | `Password INVALIDO: no debe contener el digito cero (0)` |
| `12345` | Solo tiene 5 cifras | `Password INVALIDO: no tiene exactamente 6 cifras` |

**Comando rápido de prueba:**
```sh
printf '528924\n' | ./build/a2_validar_password_6_cifras
```

---

#### A3 · Laboratorios 5 (Ciclo 2023-2): Zuckerman, $T(n)$, Número Casa y Lucas (`make a3` · Guía PUCP 2.3.9 y 2.3.10)
- **Archivo:** `ejercicios/avanzado/a3_zuckerman_y_casa_lucas.c`
- **Conceptos clave:**
  - **Modo 1:** Validación de 2 a 5 cifras con `log10` (sin bucle). Verificación de Zuckerman protegiendo `prod > 0` antes de `num % prod == 0`. Recurrencia $T(0)=2, T(n) = A^2 \cdot T(n-1)$.
  - **Modo 2:** Contraste entre el Número Casa por sumatoria $(n+1)^3 + \sum_{k=1}^{n} k^2$ y por fórmula directa $\frac{8n^3 + 21n^2 + 19n + 6}{6}$, más el término $L(n)$ de Lucas ($2, 1, 3, 4, 7, 11, \dots$).

| Modo | Entrada | Resultado esperado |
|---|---|---|
| `1` | `115` y `3 2` | `El numero 115 SI es un numero de Zuckerman (producto de digitos = 5)` · `El termino T(2) con A = 3.00 es: 162.00` |
| `1` | `105` y `2 3` | `El numero 105 NO es un numero de Zuckerman (producto de digitos = 0)` · `El termino T(3) con A = 2.00 es: 128.00` |
| `2` | `1` | `Casa(1) = 9` (ambos métodos) · `L(1) = 1` |
| `2` | `2` | `Casa(2) = 32` (ambos métodos) · `L(2) = 3` |
| `2` | `3` | `Casa(3) = 78` (ambos métodos) · `L(3) = 4` |
| `2` | `5` | `Casa(5) = 271` (ambos métodos) · `L(5) = 11` |

**Comandos rápidos de prueba:**
```sh
printf '1\n115\n3 2\n' | ./build/a3_zuckerman_y_casa_lucas
printf '2\n3\n' | ./build/a3_zuckerman_y_casa_lucas
```

---

#### A4 · Centro de Masa 2D y Sumatoria con Errores Combinados (`make a4` · Guía PUCP 2.3.7 y 2.3.8)
- **Archivo:** `ejercicios/avanzado/a4_centro_masa_y_sumatorias.c`
- **Conceptos clave:**
  - **Parte 1 (Centro de Masa):** Un único `while (x <= xf)` acumula simultáneamente área y momentos con $\Delta x = 0.001$ y devuelve $(\bar{x}, \bar{y})$ por punteros sin anidar ninguna estructura.
  - **Parte 2 (Sumatoria Lab 2021-2):** Tres `if` planos e independientes (sin `else`) permiten reportar **todas** las condiciones que fallen simultáneamente (`a` en `[2, 6]`, `b` en `[1, 5]` y `a > b`).

| Caso | Entrada Parte 1 ($a, b, c$ y $x_i, x_f$) | Entrada Parte 2 ($a, b, x$) | Resultado esperado |
|---|---|---|---|
| Parábola $f(x)=x^2$ en $[0,1]$ + Sumatoria válida | `1 0 0` y `0 1` | `4 2 1.0` | `Centro de masa: (0.7496, 0.2997)` · `Sumatoria A: -1.232143` |
| Rectángulo $f(x)=4$ en $[0,2]$ + Fallan las 3 reglas | `0 0 4` y `0 2` | `1 8 1.0` | `Centro de masa: (1.0000, 2.0000)` · Imprime los **3 mensajes de error** simultáneamente |
| Falla solo `a > b` (`a=3, b=4`) | `0 0 4` y `0 2` | `3 4 1.0` | `Centro de masa: (1.0000, 2.0000)` · Imprime solo `Error: no se cumple la condicion a > b` |

**Comando rápido de prueba:**
```sh
printf '0 0 4\n0 2\n1 8 1.0\n' | ./build/a4_centro_masa_y_sumatorias
```
