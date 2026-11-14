# Aprender C para enseñarlo

Una ruta de trabajo propia, con orientación universitaria y sin equivalencias oficiales. El criterio de avance es poder explicar y transferir una idea a un problema nuevo. Un caso aprobado en la web registra una observación, no acredita competencia.

| Tramo                       | Aprendizajes                                                                                          | Evidencia antes de avanzar                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1. Fundamentos              | Compilación, main, declaraciones, tipos, conversiones, operadores y E/S validada                      | Explicar división entera, & en scanf, = frente a == y el retorno de scanf; diseñar bordes y entradas inválidas   |
| 2. Control                  | Selección, condiciones compuestas, ciclos, contadores, acumuladores, centinelas y anidación           | Trazar el estado, expresar un invariante sencillo, demostrar progreso y justificar límites                       |
| 3. Modularidad              | Contratos, prototipos, parámetros por valor, punteros de salida                                       | Separar cálculo de E/S y dibujar qué se copia y qué objeto cambia                                                |
| 4. Colecciones              | Arreglos, índices, cadenas, terminador nulo y tamaño de búfer                                         | Justificar cada índice, conservar el terminador y distinguir bytes de caracteres visibles                        |
| 5. Memoria                  | Punteros, duración, recursión, malloc/free y estructuras                                              | Dibujar pila y reservas, asignar propiedad y detectar uso después de liberar o retorno de una dirección local    |
| 6. Aplicación               | E/S de archivos y lista enlazada inicial                                                              | Gestionar errores, cerrar recursos, distinguir almacenamiento virtual/nativo y explicar coste de recorrido       |
| 7. Profundización siguiente | Búsqueda y ordenamiento, listas dinámicas, pilas, colas, árboles, módulos .h/.c y proyecto integrador | Resolver sin solución modelo, probar casos adversos, analizar tiempo/espacio y revisar el código de otra persona |

Los tramos 1–6 tienen ejemplos ejecutables introductorios en esta entrega; el tramo 7 es trabajo posterior, no contenido ya implementado. Los ejercicios originales añaden problemas numéricos y de ciclos de mayor dificultad. Ningún programa aislado sustituye una práctica completa de diseño.

## Secuencia de una clase

1. Recuperar una idea previa y pedir una predicción (5 minutos).
2. Presentar un concepto y una traza, incluyendo el significado de los símbolos (10 minutos).
3. Cambiar una condición o dato y comprobar la hipótesis (15 minutos).
4. Introducir un error deliberado y depurar empezando por el primer diagnóstico (10 minutos).
5. Pedir una explicación y un caso que pueda refutar la solución (5 minutos).

Un comentario útil expresa intención, precondición, invariante, unidad o límite. «Incrementa i» suele aportar menos que «Avanza para que la condición de terminación pueda cumplirse». Evita convertir ejemplos académicos limitados en recomendaciones generales de producción.

## Preparar materiales universitarios

La biblioteca incorporada y su correspondencia con los tramos de la ruta están en [Fuentes docentes](FUENTES-DOCENTES.md). Las guías de estructura, programas secuenciales, selección, ciclos y modularidad ofrecen una secuencia para preparar clases; el taller del parcial y los ciclos anidados permiten integrar y transferir esas ideas.

Por cada material anota autoría, institución/facultad, curso, semestre, tema, prerrequisitos, restricciones, casos y permiso de publicación. Mantén separados el enunciado, las pistas y la solución. Las restricciones Parcial y Anidados actuales pertenecen al material existente; no representan todas las clases de PUCP, UNI o UNMSM.

Para comparar universidades hacen falta sus sílabos concretos y fechas. [Las fuentes consultadas y sus límites](ARQUITECTURA.md#fuentes-educativas) se conservan en el repo. El lenguaje de implementación puede variar entre facultades y cursos.

## Rúbrica personal

Para cada tema, valorar de 0 a 2: explicar símbolos; trazar ejecución; justificar tipos/rangos; diseñar pruebas; diagnosticar un error; adaptar la solución; explicar duración/recursos cuando corresponda. Cero: necesito consultar la solución. Uno: resuelvo con guía. Dos: explico y resuelvo una variante sin mirar. Es una herramienta de autoevaluación, no una certificación universitaria.
