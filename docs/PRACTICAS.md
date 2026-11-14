# Prácticas progresivas de Aula C

El laboratorio ofrece **42 prácticas originales**, tres por cada una de las 14 lecciones: 15 de contenidos básicos, 12 intermedias y 15 avanzadas. Sus **165 casos de referencia** se comprueban contra las soluciones C17. Se suman a los 26 programas del archivo, sin modificar sus restricciones académicas.

## Cómo trabajar cada tema

1. Lee el enunciado, identifica entrada/salida y revisa el desarrollo de la solución.
2. **Inicio:** explica los símbolos y sigue una traza corta del código resuelto.
3. **Aplicación:** justifica cómo se adapta la idea al contexto y a los límites del problema.
4. **Reto:** descompón el algoritmo, explica las decisiones y diseña un caso que detecte un error frecuente.
5. El alumno construye el programa desde cero en su propia laptop. Después compara su propuesta con el `.c` comentado y las salidas de referencia. Aula C permite ejecutar la solución como demostración; no requiere que el alumno programe en la web.

Cada ejercicio abre su solución completa por defecto. La descarga entrega el archivo C de referencia, y el apartado «Reconstruir el programa en tu laptop» incluye la secuencia de trabajo y compilación con GCC/Clang en macOS/Linux. En Xcode puede incorporarse el archivo al proyecto C del alumno. Las reglas académicas de un ejercicio particular deben revisarse contra su documento; las soluciones propias del banco no se presentan como solucionarios oficiales de PUCP.

La navegación global se realiza con los filtros superiores y la lista lateral. Cada lección muestra únicamente sus tres prácticas y el progreso local de estas; el panel no contiene filtros ni búsqueda de otros temas.

El nivel Básico/Intermedio/Avanzado señala los prerrequisitos del tema. Inicio/Aplicación/Reto señala la dificultad dentro de ese tema. Una práctica de Inicio sobre listas enlazadas requiere conocimientos avanzados de punteros y memoria.

Cada ejercicio contiene enunciado, entrada, salida, condiciones, desarrollo, casos utilizables, solución C comentada y guía docente con preguntas, errores, rúbrica y pizarra. Las tareas de salida fija tienen un único caso significativo; las restantes incluyen varios datos normales, bordes o errores según su contrato.

La plantilla incompleta se conserva como alternativa opcional. Sus borradores mantienen la ruta original `practicas/<id>.c`; la solución usa `lecciones/practicas/<id>.c`. Así se preservan borradores anteriores sin que oculten la solución por defecto. El botón «Ver solución comentada» vuelve a la referencia y «Restaurar solución» recupera su fuente original. La URL siempre abre la solución por defecto. El almacenamiento del navegador y las verificaciones son herramientas de la demostración docente, no seguimiento del trabajo personal del alumno.

## Catálogo

| Tema                             | Nivel del contenido | Inicio                                   | Aplicación                               | Reto                                    |
| -------------------------------- | ------------------- | ---------------------------------------- | ---------------------------------------- | --------------------------------------- |
| Tu primer programa               | Básico              | Un cartel para el laboratorio            | Una cita en una pantalla                 | Una boleta alineada                     |
| Variables y división entera      | Básico              | Repartir 73 fichas entre 6 equipos       | Convertir 7384 segundos                  | Un promedio que conserva decimales      |
| Leer y validar datos             | Básico              | Registrar una temperatura                | Medir una variación de nivel             | Empacar unidades con divisor válido     |
| Decidir con condiciones          | Básico              | Tarifa de una exposición                 | Costo de envío por tramos                | ¿Se abre el 29 de febrero?              |
| Sumatoria con un invariante      | Básico              | Sumar áreas de baldosas                  | Una colecta que termina con -1           | Un plano de asientos                    |
| Dividir el problema en funciones | Intermedio          | Un marco hecho por una función           | Sincronizar dos señales                  | Contar identificadores primos           |
| Direcciones y punteros           | Intermedio          | Intercambiar dos casilleros              | Dos resultados de una división           | Obtener mínimo y máximo por dirección   |
| Arreglos, índices y límites      | Intermedio          | La lectura más alta de un sensor         | Buscar un código ordenado                | Consumo por aula y turno                |
| Texto y el terminador nulo       | Intermedio          | Medir un mensaje de atención             | Vocales en un aviso                      | Contar palabras en una cola de atención |
| Recursión y pila de llamadas     | Avanzado            | Auditar la suma de dígitos               | Potencias con menos llamadas             | Un código que se lee al revés           |
| Reservar y liberar memoria       | Avanzado            | Un lote de mediciones de tamaño variable | Contar categorías con calloc             | Una lista de aportes que crece          |
| Modelar datos con struct         | Avanzado            | Recorrer cuadras entre dos puntos        | Elegir una postulación                   | Atender un pedido de almacén            |
| Archivos y errores de E/S        | Avanzado            | Guardar y recuperar una lectura          | Un reporte leído hasta el fin de archivo | Conciliar un archivo de ventas          |
| Una primera lista enlazada       | Avanzado            | Apilar tarjetas al inicio                | Respetar el orden de una fila            | Retirar todos los turnos cancelados     |

## Correspondencia temática con el material

| Material compartido                              | Ejes usados en las prácticas propias                                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Guías 1 y 2: estructura y programas secuenciales | Mensajes, formatos, tipos, división y residuo, promedios, unidades y entrada/salida                                     |
| Guía 3: selección                                | Rangos, validación, tarifas por tramos y condiciones lógicas                                                            |
| Guía 4: ciclos                                   | Contadores, acumuladores, centinelas, sumas y progreso; introducción en página PDF 6 e índice en 2–3                    |
| Guías 5/6: modularidad                           | Funciones, contratos, separación de cálculo/E/S y parámetros por valor; introducción y funciones en páginas PDF 6–8     |
| Guías 8/9: ciclos anidados                       | Reinicio del ciclo interior, planos de asientos y recorridos de matrices                                                |
| Laboratorio 10 y taller de parcial               | Contexto para integrar decisiones, recorridos y módulos; no se copian los enunciados ni se publican soluciones privadas |

Arreglos, cadenas, recursión, memoria dinámica, estructuras, archivos y listas amplían la ruta de Aula C. No se atribuyen esos temas a todas las guías anteriores. Los PDF y los borradores derivados conservan su flujo de revisión en administración; este banco es contenido propio del repositorio.

## Referencias oficiales consultadas · 2026-11-14

- [PUCP · Fundamentos de Programación, 1INF01](https://estudios-generales-ciencias.pucp.edu.pe/curso/fundamentos-de-programacion/): programación imperativa, lógica, diseño de algoritmos y estructuras selectivas e iterativas. La [guía bibliográfica de 1INF01](https://guiastematicas.biblioteca.pucp.edu.pe/eeggcc/1INF01) incluye textos sobre C.
- [UNI · FIIS · SI205, Algoritmia y Estructura de Datos](https://www.fiis.uni.edu.pe/departamentos-academicos/sistemas-y-telematica/299-si205-algoritmia-y-estructura-de-datos): continuidad hacia recursión, listas, pilas, colas y análisis de algoritmos. Se consultó su descripción pública indexada; la página no respondió al abrirla.
- [UNMSM · Ingeniería Industrial · Sumillas 2023](https://industrial.unmsm.edu.pe/escuelas-profesionales/epii/sumilla-de-los-cursos-de-la-eap-ing-industrial-2023/): la descripción pública indexada incluye funciones, arreglos y cadenas, y una progresión hacia estructuras, recursión y archivos. La página agotó el tiempo de respuesta al abrirla.

Estas fuentes orientan una propuesta didáctica propia. No prueban equivalencia de dificultad, una malla común ni el uso de C en todos los cursos. Las fechas de los planes no se interpretan como sílabos actualizados de 2026.

## Autoría y verificación

Los datos están en `web/js/practice-content/`, el adaptador en `web/js/practices.js` y las soluciones en `lecciones/practicas/`. La preparación de contenido copia esta última carpeta a la web. Los comentarios explican intención, límites o invariantes. Los archivos creados son virtuales y se reinician en cada ejecución web.

`scripts/practices.test.mjs` compila soluciones y plantillas con Clang C17, advertencias como errores y casos en temporales. `scripts/practice-ui.test.mjs` comprueba selección y progreso por lección, retorno al ejemplo, descarga de la solución y desarrollo visible. El conjunto se ejecuta con `npm run quick`. Aprobar estos casos es evidencia de esos resultados, no una prueba de corrección para cualquier entrada.
