/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-11-promedio",
    lessonId: "11-memoria",
    title: "Un lote de mediciones de tamaño variable",
    difficulty: "Inicio",
    minutes: 15,
    statement:
      "Reserva un arreglo para N mediciones y calcula su promedio, liberando la memoria también si una lectura falla.",
    inputDescription: "N de 0 a 500; luego N enteros entre -1000 y 1000.",
    outputDescription:
      "Promedio: valor con 2 decimales; si N=0 muestra Sin datos. Error: Entrada invalida y retorno 1.",
    constraints: [
      "Comprueba malloc; no dividas por N cuando es 0.",
      "El máximo de 500 mediciones permite usar una entrada por línea dentro del límite web de 4096 bytes.",
    ],
    hints: [
      "Lee y valida N antes de calcular el tamaño de la reserva.",
      "Cada salida posterior a malloc debe liberar la memoria.",
    ],
    sourceC:
      "/* Un lote de mediciones de tamaño variable\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 0;\n    int *datos = NULL;\n    /* TODO: lee n; decide como tratar el lote vacio. */\n    /* TODO: reserva, comprueba, procesa y libera en todos los caminos. */\n    (void)n; (void)datos;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-11-promedio.c",
    tests: [
      {
        name: "Vacío",
        input: "0\n",
        output: "Sin datos\n",
      },
      {
        name: "Fraccionario",
        input: "3 2 4 5\n",
        output: "Promedio: 3.67\n",
      },
      {
        name: "Negativos",
        input: "2 -1000 -500\n",
        output: "Promedio: -750.00\n",
      },
      {
        name: "Dato incompleto",
        input: "2 7\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
      {
        name: "Máximo de mediciones en la web",
        input: "500\n" + "-1000\n".repeat(500),
        output: "Promedio: -1000.00\n",
      },
      {
        name: "Supera el tamaño del lote",
        input: "501\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Reserva un arreglo para N mediciones y calcula su promedio, liberando la memoria también si una lectura falla.",
    why: "sizeof *datos relaciona la reserva con el tipo apuntado; la propiedad de la memoria exige liberarla en todos los caminos.",
    trap: "Usar sizeof(datos) reserva según el tamaño del puntero y no de los elementos.",
    teacher: "Marca en el flujo cada camino que necesita free.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Quién libera la reserva si falla una lectura?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Usar sizeof(datos) reserva según el tamaño del puntero y no de los elementos."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Tamaño validado → reserva comprobada → uso → liberación.",
    },
  },
  {
    id: "practica-11-frecuencias",
    lessonId: "11-memoria",
    title: "Contar categorías con calloc",
    difficulty: "Aplicación",
    minutes: 25,
    statement:
      "Reserva 10 contadores inicializados en cero y cuenta cuántas veces aparece cada categoría de 0 a 9.",
    inputDescription: "N de 0 a 100; después N categorías enteras entre 0 y 9.",
    outputDescription:
      "Diez conteos en orden 0..9, separados por un espacio y sin espacio final. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa calloc y libera la reserva, incluso ante entrada inválida."],
    hints: [
      "calloc inicializa a cero los contadores enteros.",
      "Valida la categoría antes de usarla como índice.",
    ],
    sourceC:
      "/* Contar categorías con calloc\n * Objetivo: Reserva 10 contadores inicializados en cero y cuenta cuántas veces aparece cada categoría de 0 a 9.\n */\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* calloc inicializa a cero los contadores enteros. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-11-frecuencias.c",
    tests: [
      {
        name: "Sin categorías",
        input: "0\n",
        output: "0 0 0 0 0 0 0 0 0 0\n",
      },
      {
        name: "Repetidas",
        input: "5 0 9 0 3 9\n",
        output: "2 0 0 1 0 0 0 0 0 2\n",
      },
      {
        name: "Extremo superior",
        input: "1 9\n",
        output: "0 0 0 0 0 0 0 0 0 1\n",
      },
      {
        name: "Índice inválido",
        input: "1 10\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Reserva 10 contadores inicializados en cero y cuenta cuántas veces aparece cada categoría de 0 a 9.",
    why: "Una frecuencia usa el valor como índice y por eso la validación debe preceder al acceso.",
    trap: "malloc no garantiza contadores inicializados; incrementar memoria indeterminada es incorrecto.",
    teacher: "Pide explicar qué garantiza calloc y qué sigue siendo responsabilidad del programa.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué garantiza calloc y qué debes validar todavía?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "malloc no garantiza contadores inicializados; incrementar memoria indeterminada es incorrecto.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Tamaño validado → reserva comprobada → uso → liberación.",
    },
  },
  {
    id: "practica-11-crecer",
    lessonId: "11-memoria",
    title: "Una lista de aportes que crece",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Almacena aportes en un arreglo que crece con realloc y muéstralos en el mismo orden cuando llegue-1.",
    inputDescription: "Hasta 100 valores entre 0 y 1000, terminados obligatoriamente por -1.",
    outputDescription:
      "Una línea con los valores separados por espacios; si no hay aportes, Vacio. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa un puntero temporal para realloc; conserva la reserva original si falla."],
    hints: [
      "realloc(NULL,tamaño) permite empezar sin reserva.",
      "No reemplaces datos hasta comprobar que el puntero nuevo no sea NULL.",
    ],
    sourceC:
      "/* Una lista de aportes que crece\n * Objetivo: Almacena aportes en un arreglo que crece con realloc y muéstralos en el mismo orden cuando llegue-1.\n */\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* realloc(NULL,tamaño) permite empezar sin reserva. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-11-crecer.c",
    tests: [
      {
        name: "Vacío",
        input: "-1\n",
        output: "Vacio\n",
      },
      {
        name: "Varios crecimientos",
        input: "8 0 1000 4 -1\n",
        output: "8 0 1000 4\n",
      },
      {
        name: "Uno",
        input: "7 -1\n",
        output: "7\n",
      },
      {
        name: "Sin centinela",
        input: "1 2\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
      {
        name: "Inválido tras reservar",
        input: "1 -2 -1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Almacena aportes en un arreglo que crece con realloc y muéstralos en el mismo orden cuando llegue-1.",
    why: "realloc puede mover la reserva; actualizar el puntero solo tras comprobar éxito conserva la propiedad de la memoria.",
    trap: "Asignar datos=realloc(datos,...) directamente pierde la dirección original si falla.",
    teacher: "Pide dibujar las reservas antes y después de un posible traslado.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué dirección perderías al sobrescribir el puntero si falla realloc?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Asignar datos=realloc(datos,...) directamente pierde la dirección original si falla."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Tamaño validado → reserva comprobada → uso → liberación.",
    },
  },
];
