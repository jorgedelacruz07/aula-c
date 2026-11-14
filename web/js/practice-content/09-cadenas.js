/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-09-longitud",
    lessonId: "09-cadenas",
    title: "Medir un mensaje de atención",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Cuenta los caracteres de un mensaje ASCII sin contar el salto de línea final.",
    inputDescription: "Una línea de 0 a 80 caracteres ASCII; una línea vacía es válida.",
    outputDescription:
      "Longitud: N. Error: Entrada invalida y retorno 1 si falta la línea o excede 80 caracteres.",
    constraints: ["Usa fgets con capacidad suficiente y recorre hasta el terminador nulo."],
    hints: [
      "El salto leído por fgets puede eliminarse antes de contar.",
      "El carácter \\0 marca el final y no forma parte de la longitud.",
    ],
    sourceC:
      "/* Medir un mensaje de atención\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    char texto[82] = {0};\n    /* TODO: lee una linea sin exceder la capacidad. */\n    /* TODO: retira el salto final y recorre hasta el byte nulo. */\n    (void)texto;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-09-longitud.c",
    tests: [
      {
        name: "Con espacios",
        input: "Hola C\n",
        output: "Longitud: 6\n",
      },
      {
        name: "Vacío",
        input: "\n",
        output: "Longitud: 0\n",
      },
      {
        name: "Sin salto final",
        input: "A",
        output: "Longitud: 1\n",
      },
      {
        name: "Exceso",
        input: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Cuenta los caracteres de un mensaje ASCII sin contar el salto de línea final.",
    why: "Una cadena de C termina en un byte nulo; la capacidad del arreglo debe incluirlo además del texto.",
    trap: "Contar el salto de línea o confundir \\0 con el carácter dígito 0.",
    teacher: "Pide dibujar bytes del mensaje Hola y su terminador.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué distingue capacidad, longitud y terminador de una cadena?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Contar el salto de línea o confundir \\0 con el carácter dígito 0."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Capacidad → texto → terminador nulo → recorrido por estado.",
    },
  },
  {
    id: "practica-09-vocales",
    lessonId: "09-cadenas",
    title: "Vocales en un aviso",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Cuenta vocales latinas sin tilde, tanto mayúsculas como minúsculas, en una línea ASCII.",
    inputDescription: "Una línea de 0 a 80 caracteres ASCII.",
    outputDescription:
      "Vocales: N. Error: Entrada invalida y retorno 1 si falta la línea o es demasiado larga.",
    constraints: ["Solo a,e,i,o,u y sus mayúsculas cuentan como vocales."],
    hints: ["Recorre cada carácter hasta \\0.", "strchr puede comprobar pertenencia al conjunto de vocales."],
    sourceC:
      "/* Vocales en un aviso\n * Objetivo: Cuenta vocales latinas sin tilde, tanto mayúsculas como minúsculas, en una línea ASCII.\n */\n#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Recorre cada carácter hasta \\0. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-09-vocales.c",
    tests: [
      {
        name: "Mezcla de casos",
        input: "Aula C ABIERTA\n",
        output: "Vocales: 7\n",
      },
      {
        name: "Sin vocales",
        input: "123 xyz\n",
        output: "Vocales: 0\n",
      },
      {
        name: "Línea vacía",
        input: "\n",
        output: "Vocales: 0\n",
      },
      {
        name: "Falta línea",
        input: "",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Cuenta vocales latinas sin tilde, tanto mayúsculas como minúsculas, en una línea ASCII.",
    why: "Una cadena puede recorrerse sin conocer su longitud previa; strchr consulta si un carácter pertenece a otro texto.",
    trap: "Asumir que todas las letras de un idioma caben en un único byte; el contrato se limita a ASCII.",
    teacher: "Pide explicar por qué vocales con tilde quedan fuera del contrato.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué el contrato limita el texto a ASCII?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "Asumir que todas las letras de un idioma caben en un único byte; el contrato se limita a ASCII.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Capacidad → texto → terminador nulo → recorrido por estado.",
    },
  },
  {
    id: "practica-09-palabras",
    lessonId: "09-cadenas",
    title: "Contar palabras en una cola de atención",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Cuenta grupos de caracteres separados por espacios o tabulaciones; múltiples separadores seguidos no crean palabras vacías.",
    inputDescription: "Una línea de 0 a 80 caracteres ASCII; espacio y tabulación son separadores.",
    outputDescription:
      "Palabras: N. Error: Entrada invalida y retorno 1 si falta la línea o excede 80 caracteres.",
    constraints: ["Reconoce el inicio de una palabra con un cambio de estado."],
    hints: [
      "Mantén una bandera dentro que indique si estás en una palabra.",
      "Solo incrementa al pasar de separador a carácter no separador.",
    ],
    sourceC:
      "/* Contar palabras en una cola de atención\n * Objetivo: Cuenta grupos de caracteres separados por espacios o tabulaciones; múltiples separadores seguidos no crean palabras vacías.\n */\n#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Mantén una bandera dentro que indique si estás en una palabra. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-09-palabras.c",
    tests: [
      {
        name: "Espacios repetidos",
        input: "  Hola   mundo C  \n",
        output: "Palabras: 3\n",
      },
      {
        name: "Tabulaciones",
        input: "uno\tdos\n",
        output: "Palabras: 2\n",
      },
      {
        name: "Solo separadores",
        input: " \t  \n",
        output: "Palabras: 0\n",
      },
      {
        name: "Sin salto final",
        input: "hola",
        output: "Palabras: 1\n",
      },
      {
        name: "Texto excesivo",
        input: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Cuenta grupos de caracteres separados por espacios o tabulaciones; múltiples separadores seguidos no crean palabras vacías.",
    why: "La bandera resume el estado del recorrido; contar transiciones evita contar espacios como palabras.",
    trap: "Contar espacios+1 falla con líneas vacías y separadores consecutivos.",
    teacher: "Pide una tabla de carácter, estado anterior y cantidad acumulada.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué transición de estado indica una palabra nueva?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Contar espacios+1 falla con líneas vacías y separadores consecutivos."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Capacidad → texto → terminador nulo → recorrido por estado.",
    },
  },
];
