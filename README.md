# Aula C · Aprende, experimenta, enseña

Guía interactiva y cuaderno de cátedra para dominar el lenguaje C y preparar clases universitarias (orientada a estándares de PUCP, UNI y UNMSM): **14 lecciones comentadas con problemas cotidianos**, **26 ejercicios originales de catálogo** con **52 casos de prueba automatizados**, **soporte de Dark Theme nativo**, **Modo Docente reforzado** y un laboratorio WebAssembly que compila C real directamente en el navegador.

---

## Características Principales

1. **Problemas cotidianos y enfoque visual intuitivo**:
   - Cada lección y ejercicio incluye un título claro y una **analogía de la vida real** destacada (ej. _Sumatoria acumulada (1 a N)_ modelada como una caja registradora o podómetro; _Validación de entrada_ como control de acceso; _Punteros_ como cajero automático que entrega dos resultados simultáneos; _Memoria dinámica_ como planilla con empleados a pedido).
   - Identificación visual con íconos temáticos y badges de nivel (_Básico_, _Intermedio_, _Avanzado_).

2. **Modo Docente Reforzado (Cockpit pedagógico universitario)**:
   - Panel estructurado diseñado para profesores y jefes de práctica (JPs) con:
     - 🎯 **Estrategia de apertura en clase**: Cómo motivar el problema antes de compilar.
     - ❓ **Preguntas socráticas**: Preguntas de activación mental para formular a los alumnos.
     - ⚠️ **Puntos ciegos frecuentes**: Errores comunes en exámenes y laboratorios universitarios (ej. `while(i<=n);`, `scanf` sin `&`, truncamiento en división entera `7/2=3`, off-by-one en arreglos).
     - 📋 **Criterios de evaluación y rúbrica**: Qué penalizar con cero y qué buenas prácticas exigir (cero variables globales, modularidad limpia, validación en cascada).
     - ✏️ **Trazabilidad en pizarra**: La tabla o esquema exacto que el docente debe dibujar.

3. **Tema Oscuro (Dark Theme) y UI/UX Compacta**:
   - Conmutador instantáneo de tema Claro / Oscuro en la barra superior con persistencia en `localStorage` y detección automática de preferencia de sistema (`prefers-color-scheme`).
   - Espacios en blanco optimizados: reducción drástica de márgenes y paddings excesivos para lograr un entorno denso, legible y ergonómico tipo panel de control.
   - Tamaños de fuente ajustados para máxima legibilidad tanto en pantallas estándar como Retina.

4. **Subpágina Rediseñada de Mentoría PUCP (`/archivo.html`)**:
   - Integrada plenamente con el sistema de diseño y tokens de Aula C.
   - Enlace directo de regreso al Aula C principal y selector de tema compartido.
   - Trazador interactivo de memoria y pila de llamadas (call stack), recetario de algoritmos sin arreglos, explorador de código con árbol top-down y quiz cazador de bugs.

---

## Empezar

Requisitos: Node 26 (mise), npm; Clang para las pruebas nativas.

```sh
npm ci
npm run dev
```

Abre **<http://127.0.0.1:5183>**. El puerto es fijo en loopback y coincide con el catálogo de Switchboard (`aulac`).

| Comando          | Resultado                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Prepara contenido e inicia Vite en `127.0.0.1:5183`                                                                             |
| `npm run format` | Formatea web, scripts y documentación con Prettier; conserva las fuentes C originales                                           |
| `npm run quick`  | Comprueba formato, ejecuta pruebas de lecciones y los 52 casos C originales en temporales, construye la web y revisa whitespace |
| `npm run test:c` | Controles académicos existentes: `make verify anidados test_anidados`                                                           |
| `npm run build`  | Genera `dist/`, listo para Firebase Hosting estático                                                                            |
| `npm run deploy` | Publicación protegida en Firebase Hosting: requiere `CONFIRM=DEPLOY FIREBASE_PROJECT=aula-c-jorge`                              |
| `make web`       | Alias de `npm run dev`                                                                                                          |

---

## Estructura de la Ruta de Aprendizaje

1. **Tu primer programa**: Saludo formal en consola (`printf`, directiva `#include`, terminación con `return 0;`).
2. **Variables y división**: Repartir la cuenta del restaurante (división entera `7/2=3`, división real `7.0/2=3.50`, operador `%`).
3. **Validar entrada**: Control de acceso por edad (lectura robusta con `scanf`, validación de dominio en cascada).
4. **Condicionales**: Sistema de calificación y actas (bifurcaciones `if/else`, rangos con `&&`, prevención de asignación accidental).
5. **Sumatoria acumulada (1 a N)**: Caja registradora e invariante (`while`, acumulador `suma += i`, avance `i++`).
6. **Funciones modulares**: Máquina calculadora y reutilización (contratos de función, prototipos, paso por valor).
7. **Punteros y referencias**: Cajero con dos resultados simultáneos (direcciones de memoria con `&`, desreferenciación con `*`).
8. **Arreglos y límites**: Registro de temperaturas (memoria contigua, indexación `0` a `n-1`, prevención de desbordamiento).
9. **Cadenas de texto**: Credencial y saludo con terminador nulo (arreglo de `char`, centinela `\0`, lectura segura con `fgets`).
10. **Recursión**: Cuenta regresiva y cálculo factorial (caso base obligatorio, caso inductivo, pila de llamadas).
11. **Memoria dinámica**: Planilla de tamaño a pedido (`malloc`, `free`, prevención de fugas de memoria).
12. **Estructuras (struct)**: Ficha de estudiante (agrupamiento de datos, acceso con punto `.` y con flecha `->`).
13. **Archivos y E/S**: Guardar historial en disco (flujos `FILE *`, `fopen`, `fclose`, persistencia y `rewind`).
14. **Listas enlazadas**: Fila de atención bancaria (nodos auto-referenciados, puntero `siguiente`, centinela `NULL`).

---

## Catálogo de Ejercicios y Casos de Examen

El repositorio incluye 26 ejercicios universitarios originales (perfiles Parcial y Anidados de EEGGCC PUCP), categorizados por dificultad y con casos de prueba reales:

- **Básico**: Secuencia numérica contigua, sumatorias, lotes de datos, triángulo de Pascal con `for`, tablas de multiplicar pitagóricas, polinomios completos, MCM y series de Wallis.
- **Intermedio**: Sensores de iluminación con punteros por referencia, rotación de dígitos y suma multibase, conjetura de Collatz y números de Catalan, intervalos y rectas, fracciones de Euclides, números capicúas multibase, números poderosos e intocables.
- **Avanzado**: Trabajo mecánico de un resorte (Ley de Hooke con sumas de Riemann), validación de PIN bancario seguro de 6 cifras, números felices y primos, números de Zuckerman y Lucas, centro de gravedad y momentos, conversión de base especial $n^k \to n$, números de Lynch-Bell y Ormiston, patrones geométricos y triángulos ASCII.

---

## Publicación en Firebase Hosting

La aplicación está diseñada para servirse como sitio estático sin requerir backend de ejecución: la compilación y ejecución de C ocurre completamente en WebAssembly (WASI/Clang 8) dentro del navegador del usuario.

- **URL de producción**: <https://aula-c-jorge.web.app>
- Proyecto Firebase exclusivo: `aula-c-jorge` (sin cuenta de facturación vinculada).
- Para desplegar nueva versión:
  ```sh
  CONFIRM=DEPLOY FIREBASE_PROJECT=aula-c-jorge npm run deploy
  ```

---

## Pruebas Nativas (Terminal y Xcode)

### Make

```sh
make list       # Lista los ejercicios disponibles por nivel
make ej1        # Compila y corre el ejercicio ej1 con Clang nativo
make test       # Ejecuta los casos de pruebas/ y verifica salida exacta
make reglas     # Revisa las restricciones académicas de los perfiles
make verify     # Compilación y verificación exhaustiva de calidad
```

### Xcode

1. Abre `Aula C.xcodeproj`.
2. En `MyTool/main.c`, selecciona el ejercicio activo modificando `#define EJERCICIO <id>` (ej. `a2` o `ej1`).
3. Presiona **Cmd + R** para depurar paso a paso con el depurador LLDB.
