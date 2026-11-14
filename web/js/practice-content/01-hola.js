/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-01-bienvenida",
    lessonId: "01-hola",
    title: "Un cartel para el laboratorio",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Muestra un cartel de bienvenida en tres líneas, sin leer datos.",
    inputDescription: "Sin entrada.",
    outputDescription:
      "Exactamente: Aula C, luego Aprende practicando, luego Bienvenido; cada texto en su propia línea.",
    constraints: ["Solo printf; no variables ni lectura de datos."],
    hints: [
      "Escribe una llamada a printf por línea.",
      "\\n termina una línea; las comillas delimitan el texto.",
    ],
    sourceC:
      "/* Un cartel para el laboratorio\n * Objetivo: Muestra un cartel de bienvenida en tres líneas, sin leer datos.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: agrega tres printf, uno por cada mensaje del contrato. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-01-bienvenida.c",
    tests: [
      {
        name: "Tres líneas",
        input: "",
        output: "Aula C\nAprende practicando\nBienvenido\n",
      },
    ],
    concept: "Muestra un cartel de bienvenida en tres líneas, sin leer datos.",
    why: "Los comentarios explican intención; printf envía texto y \\n produce el salto de línea.",
    trap: "Escribir /n en lugar de \\n imprime dos caracteres distintos.",
    teacher: "Pide predecir cuántas líneas hay antes de ejecutar.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cuántas líneas aparecen y qué parte del código termina cada una?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Escribir /n en lugar de \\n imprime dos caracteres distintos."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Cadena literal → escapes → printf → texto y saltos en consola.",
    },
  },
  {
    id: "practica-01-comillas",
    lessonId: "01-hola",
    title: "Una cita en una pantalla",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Imprime una frase que contiene comillas dobles y una segunda línea con una ruta de Windows.",
    inputDescription: "Sin entrada.",
    outputDescription: 'Primera línea: Dijo: "Practica C". Segunda línea: C:\\aula\\hola.c.',
    constraints: ["Usa escapes en cadenas de C; no escribas una tabulación accidental."],
    hints: [
      'Una comilla interior se escribe \\" dentro de la cadena.',
      "Una barra invertida literal necesita \\\\.",
    ],
    sourceC:
      "/* Una cita en una pantalla\n * Objetivo: Imprime una frase que contiene comillas dobles y una segunda línea con una ruta de Windows.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: imprime las comillas y barras literales usando escapes. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-01-comillas.c",
    tests: [
      {
        name: "Escapes literales",
        input: "",
        output: 'Dijo: "Practica C"\nC:\\aula\\hola.c\n',
      },
    ],
    concept: "Imprime una frase que contiene comillas dobles y una segunda línea con una ruta de Windows.",
    why: "Los escapes distinguen los delimitadores del lenguaje de los caracteres que quieres mostrar.",
    trap: "Una secuencia como \\a tiene significado especial; no representa barra seguida de a.",
    teacher: "Pregunta cuántos caracteres de código se necesitan para mostrar una barra.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué las comillas del mensaje necesitan escapes?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Una secuencia como \\a tiene significado especial; no representa barra seguida de a."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Cadena literal → escapes → printf → texto y saltos en consola.",
    },
  },
  {
    id: "practica-01-boleta",
    lessonId: "01-hola",
    title: "Una boleta alineada",
    difficulty: "Reto",
    minutes: 35,
    statement: "Produce una boleta fija con una cabecera y dos filas alineadas usando los anchos de printf.",
    inputDescription: "Sin entrada.",
    outputDescription:
      "ARTICULO seguido de 4 espacios y TOTAL; filas Pan con 9 espacios antes de 6 y Leche con 7 espacios antes de 8.",
    constraints: ["Formato de cada fila: %-12 s%d\\n; no uses tabulaciones."],
    hints: [
      "%-12 s reserva 12 posiciones y alinea la palabra a la izquierda.",
      "Comprueba espacios: el número comienza después de 12 caracteres de la fila.",
    ],
    sourceC:
      "/* Una boleta alineada\n * Objetivo: Produce una boleta fija con una cabecera y dos filas alineadas usando los anchos de printf.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: usa printf con %-12s para alinear cada etiqueta. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-01-boleta.c",
    tests: [
      {
        name: "Alineación exacta",
        input: "",
        output: "ARTICULO    TOTAL\nPan         6\nLeche       8\n",
      },
    ],
    concept: "Produce una boleta fija con una cabecera y dos filas alineadas usando los anchos de printf.",
    why: "Un formato expresa cómo representar un dato. El signo menos alinea el campo a la izquierda.",
    trap: "Confundir un ancho de 12 con 12 espacios: los caracteres de la palabra ocupan parte del campo.",
    teacher: "Haz contar la columna donde aparece cada total.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué Pan necesita más espacios de relleno que Leche?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "Confundir un ancho de 12 con 12 espacios: los caracteres de la palabra ocupan parte del campo.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Cadena literal → escapes → printf → texto y saltos en consola.",
    },
  },
];
