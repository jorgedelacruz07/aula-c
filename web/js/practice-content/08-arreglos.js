/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-08-maximo",
    lessonId: "08-arreglos",
    title: "La lectura más alta de un sensor",
    difficulty: "Inicio",
    minutes: 15,
    statement:
      "Guarda N mediciones en un arreglo y muestra el máximo y su primera posición, numerada desde 0.",
    inputDescription: "N de 1 a 20, seguido deN enteros entre -1000 y 1000.",
    outputDescription: "Max: X y Posicion: I en dos líneas. Error: Entrada invalida y retorno 1.",
    constraints: ["En empate conserva la primera posición."],
    hints: [
      "Inicializa el máximo usando la posición 0 después de leer.",
      "Actualiza solo cuando encuentres un valor estrictamente mayor.",
    ],
    sourceC:
      "/* La lectura más alta de un sensor\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int datos[20] = {0}, n = 0, posicion = 0;\n    /* TODO: lee n, verifica sus limites y llena datos[0..n-1]. */\n    /* TODO: conserva el indice del primer maximo. */\n    (void)datos; (void)n; (void)posicion;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-08-maximo.c",
    tests: [
      {
        name: "Primera coincidencia",
        input: "4 5 9 9 2\n",
        output: "Max: 9\nPosicion: 1\n",
      },
      {
        name: "Todos negativos",
        input: "3 -8 -2 -4\n",
        output: "Max: -2\nPosicion: 1\n",
      },
      {
        name: "Un elemento",
        input: "1 -1000\n",
        output: "Max: -1000\nPosicion: 0\n",
      },
      {
        name: "Tamaño cero",
        input: "0\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Guarda N mediciones en un arreglo y muestra el máximo y su primera posición, numerada desde 0.",
    why: "Un índice identifica la posición; almacenar el índice permite recuperar tanto el valor como su ubicación.",
    trap: "Usar >= cambia la primera coincidencia por la última.",
    teacher: "Pide justificar por qué i<n protege cada acceso.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué una comparación estricta conserva el primer máximo?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Usar >= cambia la primera coincidencia por la última."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Capacidad → cantidad válida → índices [0,n) → recorrido.",
    },
  },
  {
    id: "practica-08-busqueda",
    lessonId: "08-arreglos",
    title: "Buscar un código ordenado",
    difficulty: "Aplicación",
    minutes: 25,
    statement:
      "Encuentra la primera posición de un código mediante búsqueda binaria en una lista ordenada, o-1 si no aparece.",
    inputDescription:
      "N de 1 a 20; N enteros no decrecientes de 0 a 1000; luego un código objetivo de 0 a 1000.",
    outputDescription:
      "Posicion: I. Error: Entrada invalida y retorno 1 si la lista no está ordenada o hay datos inválidos.",
    constraints: ["Admite duplicados y devuelve la primera coincidencia."],
    hints: [
      "Usa un intervalo de búsqueda con límites inclusivos.",
      "Si encuentras el objetivo, guarda la posición y sigue buscando a la izquierda.",
    ],
    sourceC:
      "/* Buscar un código ordenado\n * Objetivo: Encuentra la primera posición de un código mediante búsqueda binaria en una lista ordenada, o-1 si no aparece.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Usa un intervalo de búsqueda con límites inclusivos. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-08-busqueda.c",
    tests: [
      {
        name: "Duplicados",
        input: "5 1 3 3 7 9 3\n",
        output: "Posicion: 1\n",
      },
      {
        name: "Ausente",
        input: "3 2 4 6 5\n",
        output: "Posicion: -1\n",
      },
      {
        name: "Único elemento",
        input: "1 0 0\n",
        output: "Posicion: 0\n",
      },
      {
        name: "Desordenado",
        input: "3 2 1 4 2\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Encuentra la primera posición de un código mediante búsqueda binaria en una lista ordenada, o-1 si no aparece.",
    why: "La búsqueda binaria descarta un intervalo gracias a la precondición de orden; continuar a la izquierda resuelve duplicados.",
    trap: "Aplicar búsqueda binaria sobre datos sin ordenar puede descartar una respuesta existente.",
    teacher: "Compara la cantidad de comparaciones con una búsqueda lineal.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué propiedad permite descartar la mitad de los datos?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "Aplicar búsqueda binaria sobre datos sin ordenar puede descartar una respuesta existente.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Capacidad → cantidad válida → índices [0,n) → recorrido.",
    },
  },
  {
    id: "practica-08-matriz",
    lessonId: "08-arreglos",
    title: "Consumo por aula y turno",
    difficulty: "Reto",
    minutes: 35,
    statement: "Lee una matriz de consumos y muestra la suma de cada fila para resumir cada aula.",
    inputDescription:
      "filas columnas entre 1 y 4; después filas*columnas enteros de 0 a 1000 en orden por filas.",
    outputDescription:
      "Una línea por fila: Aula I: S, con I numerado desde 1. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa un arreglo bidimensional y ciclos anidados."],
    hints: ["Primero almacena cada consumo en matriz[f][c].", "Reinicia suma=0 para cada aula."],
    sourceC:
      "/* Consumo por aula y turno\n * Objetivo: Lee una matriz de consumos y muestra la suma de cada fila para resumir cada aula.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Primero almacena cada consumo en matriz[f][c]. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-08-matriz.c",
    tests: [
      {
        name: "Dos aulas",
        input: "2 3 10 20 30 5 0 8\n",
        output: "Aula 1: 60\nAula 2: 13\n",
      },
      {
        name: "Una celda",
        input: "1 1 1000\n",
        output: "Aula 1: 1000\n",
      },
      {
        name: "Filas en cero",
        input: "2 1 0 0\n",
        output: "Aula 1: 0\nAula 2: 0\n",
      },
      {
        name: "Dato faltante",
        input: "1 2 7\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Lee una matriz de consumos y muestra la suma de cada fila para resumir cada aula.",
    why: "Cada dimensión tiene su propio índice y límite; el acumulador por fila debe reiniciarse al cambiar de aula.",
    trap: "Conservar la suma de la fila anterior convierte totales por aula en acumulados.",
    teacher: "Dibuja la matriz y señala qué índice cambia más rápido.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué reinicias la suma al cambiar de fila?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Conservar la suma de la fila anterior convierte totales por aula en acumulados."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Capacidad → cantidad válida → índices [0,n) → recorrido.",
    },
  },
];
