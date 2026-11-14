/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-05-cuadrados",
    lessonId: "05-ciclos",
    title: "Sumar áreas de baldosas",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Suma los cuadrados de los enteros desde 1 hasta N usando un ciclo.",
    inputDescription: "N entero entre 0 y 100.",
    outputDescription: "Suma: N calculada; para 0 la suma vacía es 0. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa acumulador y ciclo; el mayor resultado es 338350."],
    hints: ["Inicializa la suma en 0.", "Tras procesar i, la suma contiene 1²+...+i²."],
    sourceC:
      "/* Sumar áreas de baldosas\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int n = 0, suma = 0;\n    /* TODO: lee y valida n. */\n    /* TODO: acumula los cuadrados mediante un ciclo. */\n    (void)n; (void)suma;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-05-cuadrados.c",
    tests: [
      {
        name: "Suma vacía",
        input: "0\n",
        output: "Suma: 0\n",
      },
      {
        name: "Tres baldosas",
        input: "3\n",
        output: "Suma: 14\n",
      },
      {
        name: "Máximo",
        input: "100\n",
        output: "Suma: 338350\n",
      },
      {
        name: "Negativo",
        input: "-1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Suma los cuadrados de los enteros desde 1 hasta N usando un ciclo.",
    why: "El acumulador representa una suma parcial y la variable de control garantiza progreso.",
    trap: "Empezar en 1 cuando N=0 no debe introducir un término extra.",
    teacher: "Pide la traza de i y suma para N=3.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué representa suma antes de procesar el siguiente cuadrado?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Empezar en 1 cuando N=0 no debe introducir un término extra."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Inicialización → condición → cuerpo → progreso → invariante.",
    },
  },
  {
    id: "practica-05-sentinela",
    lessonId: "05-ciclos",
    title: "Una colecta que termina con -1",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Lee aportes enteros hasta -1 y muestra cantidad y suma. El centinela no es un aporte.",
    inputDescription: "Hasta 100 aportes de 0 a 1000, seguidos obligatoriamente por -1.",
    outputDescription: "Aportes: X y Total: Y en dos líneas. Error: Entrada invalida y retorno 1.",
    constraints: ["Rechaza una secuencia sin centinela, datos fuera del dominio o más de 100 aportes."],
    hints: [
      "Lee antes de decidir si el valor debe acumularse.",
      "Comprueba el límite de cantidad antes de incorporar un aporte adicional.",
    ],
    sourceC:
      "/* Una colecta que termina con -1\n * Objetivo: Lee aportes enteros hasta -1 y muestra cantidad y suma. El centinela no es un aporte.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Lee antes de decidir si el valor debe acumularse. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-05-sentinela.c",
    tests: [
      {
        name: "Colecta vacía",
        input: "-1\n",
        output: "Aportes: 0\nTotal: 0\n",
      },
      {
        name: "Incluye cero",
        input: "20 0 35 -1\n",
        output: "Aportes: 3\nTotal: 55\n",
      },
      {
        name: "Aporte máximo",
        input: "1000 -1\n",
        output: "Aportes: 1\nTotal: 1000\n",
      },
      {
        name: "Falta centinela",
        input: "5 8\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
      {
        name: "Valor no permitido",
        input: "-2 -1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Lee aportes enteros hasta -1 y muestra cantidad y suma. El centinela no es un aporte.",
    why: "Un ciclo por centinela termina por el significado de un dato; el dato de control no se procesa como aporte.",
    trap: "Sumar-1 antes de comprobarlo altera el total.",
    teacher: "Pide diferenciar cantidad de datos y suma de sus valores.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué el centinela no incrementa el contador ni el total?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Sumar-1 antes de comprobarlo altera el total."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Inicialización → condición → cuerpo → progreso → invariante.",
    },
  },
  {
    id: "practica-05-asientos",
    lessonId: "05-ciclos",
    title: "Un plano de asientos",
    difficulty: "Reto",
    minutes: 35,
    statement: "Dibuja un rectángulo de asientos con filas y columnas, usando un asterisco por asiento.",
    inputDescription: "Dos enteros filas columnas, ambos entre 0 y 8.",
    outputDescription:
      "Una línea de columnas asteriscos por fila, sin espacios. Si filas=0 no hay salida; si columnas=0 cada fila es vacía. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa dos ciclos anidados y reinicia la columna en cada fila."],
    hints: [
      "El ciclo exterior representa las filas.",
      "Imprime el salto de línea después del ciclo de columnas.",
    ],
    sourceC:
      "/* Un plano de asientos\n * Objetivo: Dibuja un rectángulo de asientos con filas y columnas, usando un asterisco por asiento.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* El ciclo exterior representa las filas. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-05-asientos.c",
    tests: [
      {
        name: "Plano2 por3",
        input: "2 3\n",
        output: "***\n***\n",
      },
      {
        name: "Sin filas",
        input: "0 4\n",
        output: "",
      },
      {
        name: "Filas vacías",
        input: "2 0\n",
        output: "\n\n",
      },
      {
        name: "Un asiento",
        input: "1 1\n",
        output: "*\n",
      },
      {
        name: "Excede tamaño",
        input: "9 2\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Dibuja un rectángulo de asientos con filas y columnas, usando un asterisco por asiento.",
    why: "Los ciclos anidados recorren el producto de dos dimensiones; reiniciar la columna es parte del contrato de cada fila.",
    trap: "Imprimir el salto dentro del ciclo interior convierte el plano en una columna.",
    teacher: "Pide contar iteraciones y distinguirlas de la cantidad de saltos de línea.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cuántos asteriscos y cuántos saltos de línea se imprimen?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Imprimir el salto dentro del ciclo interior convierte el plano en una columna."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Inicialización → condición → cuerpo → progreso → invariante.",
    },
  },
];
