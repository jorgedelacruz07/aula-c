# Aula C · Aprende, experimenta, enseña

Guía progresiva para aprender C y preparar clases: **14 lecciones comentadas**, **26 ejercicios originales** y **52 casos originales**. La teoría explica decisiones y símbolos; el laboratorio permite editar, compilar y ejecutar C real en el navegador. Xcode y Make siguen disponibles para trabajo nativo.

## Empezar

Requisitos: Node 26 (mise), npm; Clang para las pruebas nativas. Desde este repositorio:

```sh
npm ci
npm run dev
```

Abre **<http://127.0.0.1:5183>**. El puerto es fijo, en loopback, y coincide con el catálogo de Switchboard (`ctesting`). Si ya hay un proceso escuchando, el comando falla para evitar un puerto distinto. Desde Switchboard, refresca el catálogo de proyectos; el launcher externo es `project-dev ctesting`.

La primera preparación descarga el compilador web y comprueba sus hashes. Las ejecuciones siguientes usan los recursos locales. No necesitas Xcode para practicar en la web; las verificaciones nativas sí requieren Clang.

| Comando          | Resultado                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Prepara contenido e inicia Vite en `127.0.0.1:5183`                                                                             |
| `npm run format` | Formatea web, scripts y documentación con Prettier; conserva las fuentes C originales                                           |
| `npm run quick`  | Comprueba formato, ejecuta pruebas de lecciones y los 52 casos C originales en temporales, construye la web y revisa whitespace |
| `npm run test:c` | Controles académicos existentes: `make verify anidados test_anidados`                                                           |
| `npm run build`  | Genera `dist/`, listo para Hosting estático                                                                                     |
| `npm run deploy` | Publicación protegida: requiere destino explícito y `CONFIRM=DEPLOY`; ver arquitectura                                          |
| `make web`       | Alias de `npm run dev`                                                                                                          |

## Usar la guía

Elige nivel y tema, lee el concepto y pulsa los símbolos para explicar su significado. Predice el resultado antes de **Ejecutar C**. El editor permite modificar el programa; stdin recibe los datos que leerán `scanf` o `fgets`. **Verificar casos** compara la salida y el estado de terminación con los casos guardados. Los diagnósticos de compilación se muestran en la consola. **Detener** termina el worker activo.

Activa **Modo docente** para ver propuestas de explicación, trazas y preguntas. Cada lección contiene un error frecuente y un reto abierto: los casos verifican el ejemplo de referencia, no corrigen automáticamente el reto ni certifican dominio. Borradores y verificaciones se guardan solo en el navegador; puedes restaurar el ejemplo o descargar tu versión `.c` para Xcode.

La ruta pasa por tipos, E/S validada, decisiones, ciclos, funciones, punteros, arreglos, cadenas, recursión, memoria dinámica, estructuras, archivos y una lista enlazada inicial. El objetivo docente y las siguientes profundizaciones están en [el plan de aprendizaje](docs/PLAN-DOCENTE.md).

En **Tus ejercicios** puedes filtrar el material original por perfil, nivel y nombre. Los perfiles PUCP Parcial/Anidados describen el material existente, no restricciones del lenguaje C. Los programas sin casos se identifican expresamente. El archivo de mentoría previo permanece en `/archivo.html`.

## Incorporar material

- **Abrir .c** carga un archivo local de hasta 64 KiB en el editor; no lo envía a un servidor.
- Para conservarlo en el catálogo, agrégalo a `ejercicios/` y vuelve a ejecutar `npm run dev`. Se descubre automáticamente; el nivel se infiere del directorio. Las pruebas originales se emparejan por identificador; para una lección nueva agrega sus casos en el currículo.
- Los nuevos ejemplos de la ruta viven en `lecciones/`. Teoría, guion y casos están en `web/js/curriculum.js`; el glosario contextual, en `web/js/learning.js`.
- Documenta origen, curso, semestre, restricciones y permiso de uso antes de publicar material universitario. No se incorporaron materiales externos privados.

## Firebase

La arquitectura permite **Firebase Hosting estático**: C se compila a WebAssembly con Clang/WASI en el navegador. No requiere Functions ni un servidor que ejecute código de alumnos. `firebase.json` incluye las cabeceras de aislamiento necesarias. **Publicado:** <https://aula-c-jorge.web.app>. Proyecto y sitio exclusivos `aula-c-jorge`, sin cuenta de facturación vinculada (verificado el 2026-11-13). Para actualizar: `CONFIRM=DEPLOY FIREBASE_PROJECT=aula-c-jorge npm run deploy`. El compilador ocupa aproximadamente 50 MB, más bibliotecas; hay que revisar transferencia antes de difundirlo.

Consulta [arquitectura, límites, fuentes y publicación](docs/ARQUITECTURA.md). El compilador web es Clang 8/WASI y difiere de Clang/macOS: no todas las bibliotecas ni funciones del sistema están disponibles. Las fuentes universitarias son orientación con alcance explícito, no equivalencias oficiales de sílabos.

## Material nativo existente

Los 26 ejercicios autónomos conservan el proyecto Xcode, sus comentarios, los perfiles académicos y las pruebas. Los ejemplos nuevos de `lecciones/` aprenden C general y no se someten a las restricciones académicas de `make reglas`.

## Opción A: Terminal

Abre Terminal.app en la carpeta del proyecto (en Finder: clic derecho sobre la carpeta → _Servicios → Nuevo Terminal en la carpeta_, o `cd ~/Downloads/C-Testing`):

```sh
make list       # muestra los ejercicios disponibles por nivel
make ej1        # compila y ejecuta ej1 (igual ej2..ej5, b1..b3, i1..i3, a1..a4)
make all        # compila los 16 programas del perfil Parcial en build/
make test       # corre los 30 casos de pruebas/ y compara la salida exacta
make reglas     # revisa que los archivos cumplan las restricciones del curso
make ansi       # verifica que compilen en ANSI C89 estricto (-std=c89 -pedantic)
make verify     # compila y ejecuta todas las comprobaciones de calidad
make clean      # borra build/
```

Ejecutar un caso concreto sin teclear los datos:

```sh
./build/ej1_secuencia_digitos < pruebas/ej1_caso1_suma.in
printf '97531 5\n+\n' | ./build/ej1_secuencia_digitos
```

Se compila con `clang -Wall -Wextra ... -lm`. Cada `.c` se compila **por separado**, así que nunca chocan los `main`.

## Opción B: Xcode (para usar el depurador)

### Por qué funciona así

El target **MyTool** usa una _carpeta sincronizada_: Xcode compila **todo** `.c` que esté dentro de `MyTool/`. Si se copiaran ahí todos los ejercicios habría múltiples funciones `main` y el enlazador fallaría con:

```
duplicate symbol '_main' in: ej1_....o  ej2_....o
```

Por eso los ejercicios están en `ejercicios/`, fuera del target, y `MyTool/main.c` es un **selector** que incluye uno solo.

### Uso

1. Abre `C-Testing.xcodeproj`.
2. En `MyTool/main.c` cambia la línea `#define EJERCICIO a1` por el identificador que quieras (`1`–`5`, `ej1`–`ej5`, `b1`–`b3`, `i1`–`i3` o `a1`–`a4`).
3. **Cmd + R**. Escribe los datos en la consola de Xcode (panel inferior; si no aparece, _View → Debug Area → Activate Console_, o Shift + Cmd + C).

### Breakpoints en los ejercicios

La carpeta `ejercicios` aparece en el navegador del proyecto (panel izquierdo) **sin pertenecer a ningún target**: se puede leer y editar, pero Xcode no la compila por separado. Si algún día marcas un ejercicio en _Target Membership_ (inspector de archivo, panel derecho), vuelve el error `duplicate symbol '_main'`: déjalo desmarcado.

Haz clic en el número de línea de un ejercicio para poner un breakpoint. Como `main.c` incluye ese archivo, el breakpoint se activa normalmente.

Comandos útiles en la consola `(lldb)` al detener la ejecución:

```
bt                 # pila de llamadas: main -> procesar_mediciones -> clasificar_iluminancia
frame variable     # variables del frame actual
p &numero          # dirección de una variable de main
p num              # dentro de leer(): el puntero (la misma dirección)
p *num             # el valor al que apunta
up / down          # moverse entre frames de la pila
```

> **Importante:** el `#include "...c"` de `main.c` es solo un selector para Xcode. En una evaluación se entrega **un único `.c`** como los de `ejercicios/`, con únicamente `<stdio.h>`, `<math.h>` y `<stdlib.h>`.

## Reglas del curso aplicadas en todo el código

| Regla                                                                  | Cómo se cumple                                                                  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Solo `stdio.h`, `math.h`, `stdlib.h`                                   | `make reglas` lo verifica                                                       |
| Solo `int`, `double`, `char`                                           | sin `float`, `long`, `bool`, `struct`, arreglos                                 |
| Solo `while`                                                           | sin `for`, `do-while`, `switch`, `break`, `continue` (banderas en la condición) |
| Contar cifras sin bucle                                                | `(int)log10(num) + 1` tras validar `num > 0`, o rangos con `&&`                 |
| 3 zonas                                                                | includes + prototipos → `int main()` → definiciones                             |
| Funciones vs procedimientos                                            | cada prototipo está etiquetado en un comentario                                 |
| Factoriales en `double`, `1.0 / fact`, `fabs(a - b) < tol`             | ver Ej2, I1, A4 y Ej5                                                           |
| `scanf("%d", num)` sin `&` si `num` ya es puntero; `" %c"` con espacio | todos los módulos de lectura                                                    |

## Guías 8-9: ciclos iterativos anidados

Se añadieron diez programas autónomos en `ejercicios/anidados/`:

- `make nb1`, `make nb2`, `make nb3`: Pascal; tablas por dígito y pitagórica; primos gemelos, Armstrong y Mersenne.
- `make ni1`, `make ni2`, `make ni3`: Goldbach y fracciones; juego de capicúas y multibase; poderosos, intocables y secuencias con centinela.
- `make na1`, `make na2`, `make na3`, `make na4`: cambio de base especial; familias de primos; Lynch-Bell/Ormiston; odontológicos y triángulos.
- `make anidados` compila la batería; `make test_anidados` ejecuta sus casos guardados en `pruebas/anidados_*.in/.out`.
- `make reglas` valida los perfiles Parcial (Guías 1-6) y Anidados (Guías 8-9).
- `make web` sirve la plataforma en <http://127.0.0.1:5183>; detener con Ctrl-C.

### Archivo de la sesión con Mauricio

El material anterior sigue disponible en <http://127.0.0.1:5183/archivo.html>. Conserva el mapa de reglas, traducción PSeInt/C, simulación de punteros, recetas, catálogo y quiz. Sus estilos se compilan localmente; Prism para resaltado conserva el CDN. La nueva Aula C usa recursos locales.

### Límites didácticos de los ejemplos

Los casos añadidos son casos de regresión de esta práctica y no se presentan como transcripciones oficiales de evaluaciones PUCP. Cada ejercicio documenta en sus comentarios el perfil y la intención técnica. Revisar rangos y límites antes de adaptar los algoritmos a entradas mayores.
