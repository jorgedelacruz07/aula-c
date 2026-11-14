/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-10-digitos",
    lessonId: "10-recursion",
    title: "Auditar la suma de dígitos",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Implementa una función recursiva que sume los dígitos decimales de un entero no negativo.",
    inputDescription: "N entre 0 y 1000000000.",
    outputDescription: "Digitos: suma. Error: Entrada invalida y retorno 1.",
    constraints: ["Caso base: un número menor que 10. No conviertas el número en texto."],
    hints: ["N%10 extrae el último dígito.", "N/10 reduce estrictamente un número de dos o más dígitos."],
    sourceC:
      "/* Auditar la suma de dígitos\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int n = 0;\n    /* TODO: implementa sumar_digitos con un caso base y una reduccion. */\n    /* TODO: lee, valida y llama a la funcion. */\n    (void)n;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-10-digitos.c",
    tests: [
      {
        name: "Cero",
        input: "0\n",
        output: "Digitos: 0\n",
      },
      {
        name: "Varios dígitos",
        input: "90817\n",
        output: "Digitos: 25\n",
      },
      {
        name: "Límite",
        input: "1000000000\n",
        output: "Digitos: 1\n",
      },
      {
        name: "Negativo",
        input: "-1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Implementa una función recursiva que sume los dígitos decimales de un entero no negativo.",
    why: "La recursión delega un problema más pequeño y combina su resultado con el dígito retirado.",
    trap: "Olvidar que 0 también necesita un caso base provoca llamadas infinitas.",
    teacher: "Pide escribir la pila de llamadas para 507.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué dividir entre 10 garantiza alcanzar el caso base?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Olvidar que 0 también necesita un caso base provoca llamadas infinitas."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Caso base → subproblema menor → llamada → combinación.",
    },
  },
  {
    id: "practica-10-potencia",
    lessonId: "10-recursion",
    title: "Potencias con menos llamadas",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Calcula base elevada a exponente mediante exponenciación recursiva por cuadrados.",
    inputDescription:
      "Base entre -9 y 9; exponente entre 0 y 18. En este contrato cualquier base elevada a 0, incluido 0, produce 1.",
    outputDescription: "Potencia: valor entero. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa long long para el resultado; guarda una sola llamada recursiva a exponente/2."],
    hints: [
      "Si e=0, retorna 1.",
      "Calcula mitad=potencia(b,e/2); combina mitad*mitad y multiplica por b solo si e es impar.",
    ],
    sourceC:
      "/* Potencias con menos llamadas\n * Objetivo: Calcula base elevada a exponente mediante exponenciación recursiva por cuadrados.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Si e=0, retorna1. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-10-potencia.c",
    tests: [
      {
        name: "Exponente cero",
        input: "0 0\n",
        output: "Potencia: 1\n",
      },
      {
        name: "Signo impar",
        input: "-3 5\n",
        output: "Potencia: -243\n",
      },
      {
        name: "Límite seguro",
        input: "9 18\n",
        output: "Potencia: 150094635296999121\n",
      },
      {
        name: "Base cero",
        input: "0 7\n",
        output: "Potencia: 0\n",
      },
      {
        name: "Exponente excesivo",
        input: "2 19\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Calcula base elevada a exponente mediante exponenciación recursiva por cuadrados.",
    why: "Dividir el exponente reduce la profundidad a orden logarítmico; almacenar la llamada evita repetir trabajo.",
    trap: "Usar int para el resultado o volver a llamar dos veces con el mismo subproblema.",
    teacher: "Compara la cantidad de llamadas con multiplicar la base 18 veces.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cuántas llamadas necesitas para exponente 18?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Usar int para el resultado o volver a llamar dos veces con el mismo subproblema."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Caso base → subproblema menor → llamada → combinación.",
    },
  },
  {
    id: "practica-10-palindromo",
    lessonId: "10-recursion",
    title: "Un código que se lee al revés",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Comprueba recursivamente si una línea ASCII es un palíndromo exacto: espacios y mayúsculas sí importan.",
    inputDescription: "Una línea de 0 a 80 caracteres ASCII.",
    outputDescription:
      "Palindromo o Distinto. Error: Entrada invalida y retorno 1 si falta línea o excede 80 caracteres.",
    constraints: ["Compara extremos y reduce el intervalo; la línea vacía es palíndroma."],
    hints: [
      "El caso base termina cuando izquierda>=derecha.",
      "Usa un índice derecho con signo para representar la línea vacía sin desbordar size_t.",
    ],
    sourceC:
      "/* Un código que se lee al revés\n * Objetivo: Comprueba recursivamente si una línea ASCII es un palíndromo exacto: espacios y mayúsculas sí importan.\n */\n#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* El caso base termina cuando izquierda>=derecha. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-10-palindromo.c",
    tests: [
      {
        name: "Impar",
        input: "radar\n",
        output: "Palindromo\n",
      },
      {
        name: "Par",
        input: "abba\n",
        output: "Palindromo\n",
      },
      {
        name: "Distingue mayúscula",
        input: "Aa\n",
        output: "Distinto\n",
      },
      {
        name: "Vacío",
        input: "\n",
        output: "Palindromo\n",
      },
      {
        name: "Sin línea",
        input: "",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Comprueba recursivamente si una línea ASCII es un palíndromo exacto: espacios y mayúsculas sí importan.",
    why: "El intervalo de índices expresa el subproblema y garantiza que no se acceda a una posición fuera de la cadena.",
    trap: "Restar 1 a una longitud sin signo cuando la cadena está vacía produce un valor enorme.",
    teacher: "Pide justificar el orden del caso base antes del acceso a los extremos.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cómo representas el extremo derecho de una cadena vacía?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Restar 1 a una longitud sin signo cuando la cadena está vacía produce un valor enorme."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Caso base → subproblema menor → llamada → combinación.",
    },
  },
];
