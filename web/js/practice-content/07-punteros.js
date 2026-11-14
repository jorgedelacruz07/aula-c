/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-07-intercambio",
    lessonId: "07-punteros",
    title: "Intercambiar dos casilleros",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Implementa intercambiar(int*,int*) para permutar dos valores mediante sus direcciones.",
    inputDescription: "Dos enteros entre -1000 y 1000.",
    outputDescription:
      "a b después del intercambio, separados por un espacio. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa una variable temporal y no aritmética para intercambiar."],
    hints: ["main pasa &a y &b.", "Dentro de la función *a nombra el objeto apuntado, no el puntero."],
    sourceC:
      "/* Intercambiar dos casilleros\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int a = 0, b = 0;\n    /* TODO: implementa intercambiar(int *a, int *b) antes de main. */\n    /* TODO: lee y valida; llama a la funcion con direcciones. */\n    (void)a; (void)b;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-07-intercambio.c",
    tests: [
      {
        name: "Distintos",
        input: "3 8\n",
        output: "8 3\n",
      },
      {
        name: "Negativo y cero",
        input: "-1000 0\n",
        output: "0 -1000\n",
      },
      {
        name: "Iguales",
        input: "5 5\n",
        output: "5 5\n",
      },
      {
        name: "Falta valor",
        input: "2\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Implementa intercambiar(int*,int*) para permutar dos valores mediante sus direcciones.",
    why: "C copia los valores de puntero; la indirección permite modificar los objetos originales.",
    trap: "Asignar a=b intercambia direcciones locales, no los valores de los casilleros.",
    teacher: "Dibuja variables, direcciones y la copia de cada puntero.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué se copia al pasar &a y qué cambia al asignar a *a?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Asignar a=b intercambia direcciones locales, no los valores de los casilleros."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Objetos → copia de direcciones → indirección → objetos modificados.",
    },
  },
  {
    id: "practica-07-division",
    lessonId: "07-punteros",
    title: "Dos resultados de una división",
    difficulty: "Aplicación",
    minutes: 25,
    statement:
      "Implementa dividir(a,b,&cociente,&resto) para devolver dos resultados mediante parámetros de salida.",
    inputDescription: "a entre 0 y 10000; b entre 1 y 100.",
    outputDescription: "Cociente: X y Resto: Y en dos líneas. Error: Entrada invalida y retorno 1.",
    constraints: ["Los punteros recibidos apuntan a objetos int válidos de main."],
    hints: [
      "Una función void puede escribir en dos objetos mediante punteros.",
      "Separa las precondiciones validadas por main del cálculo del módulo.",
    ],
    sourceC:
      "/* Dos resultados de una división\n * Objetivo: Implementa dividir(a,b,&cociente,&resto) para devolver dos resultados mediante parámetros de salida.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Una función void puede escribir en dos objetos mediante punteros. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-07-division.c",
    tests: [
      {
        name: "Con resto",
        input: "29 6\n",
        output: "Cociente: 4\nResto: 5\n",
      },
      {
        name: "Cero unidades",
        input: "0 1\n",
        output: "Cociente: 0\nResto: 0\n",
      },
      {
        name: "División exacta",
        input: "10000 100\n",
        output: "Cociente: 100\nResto: 0\n",
      },
      {
        name: "Divisor cero",
        input: "3 0\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Implementa dividir(a,b,&cociente,&resto) para devolver dos resultados mediante parámetros de salida.",
    why: "Los parámetros de salida separan el valor retornado por una función de los objetos que puede modificar por dirección.",
    trap: "Omitir & en la llamada entrega un entero donde se necesita una dirección.",
    teacher: "Pide contrastar las copias de a,b con los objetos cociente,resto.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cómo devuelve dos resultados una función void?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Omitir & en la llamada entrega un entero donde se necesita una dirección."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Objetos → copia de direcciones → indirección → objetos modificados.",
    },
  },
  {
    id: "practica-07-limites",
    lessonId: "07-punteros",
    title: "Obtener mínimo y máximo por dirección",
    difficulty: "Reto",
    minutes: 35,
    statement: "Implementa extremos(a,b,c,&menor,&mayor) para informar los extremos de tres mediciones.",
    inputDescription: "Tres enteros entre -1000 y 1000.",
    outputDescription: "Min: X y Max: Y en dos líneas. Error: Entrada invalida y retorno 1.",
    constraints: ["Inicializa ambos extremos a partir de un dato, no de 0."],
    hints: [
      "El primer valor sirve como mínimo y máximo provisional.",
      "Compara los otros dos datos contra ambos acumuladores.",
    ],
    sourceC:
      "/* Obtener mínimo y máximo por dirección\n * Objetivo: Implementa extremos(a,b,c,&menor,&mayor) para informar los extremos de tres mediciones.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* El primer valor sirve como mínimo y máximo provisional. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-07-limites.c",
    tests: [
      {
        name: "Orden mezclado",
        input: "7 -3 5\n",
        output: "Min: -3\nMax: 7\n",
      },
      {
        name: "Todos negativos",
        input: "-4 -9 -1\n",
        output: "Min: -9\nMax: -1\n",
      },
      {
        name: "Empate total",
        input: "2 2 2\n",
        output: "Min: 2\nMax: 2\n",
      },
      {
        name: "Dato fuera de rango",
        input: "0 1 1001\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Implementa extremos(a,b,c,&menor,&mayor) para informar los extremos de tres mediciones.",
    why: "Inicializar con un dato preserva el dominio real de las mediciones; los punteros devuelven ambos extremos.",
    trap: "Inicializar mayor=0 falla cuando todas las mediciones son negativas.",
    teacher: "Pide un conjunto que detecte la mala inicialización en 0.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué falla al inicializar ambos extremos en cero?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Inicializar mayor=0 falla cuando todas las mediciones son negativas."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Objetos → copia de direcciones → indirección → objetos modificados.",
    },
  },
];
