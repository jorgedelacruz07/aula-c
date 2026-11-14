# Fuentes docentes incorporadas

Registro de incorporación del **2026-11-14**. Los PDF originales se conservan privados en la biblioteca de Aula C. Los recursos derivados quedan como borradores en `/admin`; el aula pública utiliza únicamente el material que el docente revisa y publica.

Además, el laboratorio incluye **42 prácticas originales de Aula C con 165 casos ejecutados**, descritas en [Prácticas progresivas](PRACTICAS.md). Este contenido versionado desarrolla los temas de las guías y referencias universitarias; es independiente de los borradores privados generados por IA y de sus 64 casos propuestos. Incorporar estas prácticas no publica los PDF ni aprueba sus borradores.

## Nuevas fuentes de 1INF01 · PUCP · 2026-2

| Orden     | Fuente                                             | Páginas PDF | Lecciones | Ejercicios | Aporte a la progresión                                                              |
| --------- | -------------------------------------------------- | ----------: | --------: | ---------: | ----------------------------------------------------------------------------------- |
| 1         | Guía #1 · Estructura básica de un programa         |          45 |         3 |          3 | Estructura de C, variables, tipos, operadores y explicación de símbolos             |
| 2         | Guía #2 · Elaboración de programas secuenciales    |          51 |         3 |          4 | Entrada, procesamiento y salida; fórmulas, división entera, módulo y unidades       |
| 3         | Guía #3 · Estructuras algorítmicas selectivas      |          67 |         3 |          4 | Condiciones, if, if-else, decisiones anidadas y funciones por tramos                |
| 4         | Guía #4 · Ciclos iterativos con entrada controlada |          64 |         3 |          4 | while, progreso del ciclo, contadores, series y procesamiento de datos              |
| 5         | Guía #5/#6 · Programación modular                  |          71 |         3 |          4 | Contratos, prototipos, funciones, copias de argumentos y uso de punteros            |
| 6         | Taller para el parcial · Solucionario              |          11 |         2 |          3 | Integración de funciones, decisiones, validación, magnitudes físicas y recurrencias |
| **Total** | **6 documentos**                                   |     **309** |    **17** |     **22** | **64 casos de referencia propuestos**                                               |

Estos se suman al Laboratorio 10 (21 páginas, semestre 2026-1) y la guía #8/#9 de ciclos anidados (68 páginas, semestre 2026-2), incorporados anteriormente. La biblioteca cuenta con ocho fuentes y 398 páginas al cierre de este registro.

## Cómo alimentan el aprendizaje

La secuencia de las guías 1–4 refuerza los tramos de fundamentos y control de [la ruta docente](PLAN-DOCENTE.md). Las guías 5/6 preparan modularidad y punteros; el taller permite integrar esas ideas antes de trabajar los ciclos anidados de las guías 8/9.

Cada borrador combina teoría, explicación del porqué, símbolos, C comentado, problemas aplicados y casos. Las lecciones incluyen apertura de clase, preguntas, errores frecuentes, rúbrica y esquema de pizarra. Al publicar un material, sus recursos se pueden llevar al laboratorio y conservan su guía docente y explicaciones de símbolos.

El análisis conserva el documento completo como fuente, pero genera una selección representativa: no convierte automáticamente cada página o problema en un recurso independiente. Tampoco sustituye la revisión del sílabo, las restricciones de cada evaluación ni el permiso de uso del material.

Las referencias por páginas son puntos de partida para revisar los recursos contra la fuente. Las restricciones de un ejercicio particular no se atribuyen al lenguaje C ni a todas las clases de una universidad.

## Preparación y revisión docente

Se aclararon en los borradores tres distinciones que conviene enseñar expresamente:

- La precedencia y asociatividad agrupan expresiones; no fijan por sí solas todo el orden de evaluación.
- C pasa argumentos por valor. Al pasar una dirección se copia un valor de puntero, que permite acceder al objeto original mediante indirección.
- Una sucesión definida por recurrencia puede implementarse iterativamente; no exige recursión ni arreglos.

Se completó la guía de clase que faltaba en algunos recursos y se verificaron la estructura de datos, los comentarios en los ejemplos y que las referencias estuvieran dentro del número de páginas de su PDF.

Los 64 casos son propuestas del material derivado, no resultados de ejecución verificados. Antes de publicar corresponde comprobar las fórmulas, el retorno de scanf, los rangos, el desbordamiento y la salida exacta. En el taller de Tribonacci debe revisarse especialmente si el filtro de pares/impares se refiere al valor del término o a su posición.

Los PDF, sus borradores completos y sus identificadores internos no forman parte del repositorio. El comportamiento del análisis y la publicación se documenta en [la arquitectura](ARQUITECTURA.md#ingesta-y-publicación-de-documentos).
