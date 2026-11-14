/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-03-termometro",
    lessonId: "03-entrada",
    title: "Registrar una temperatura",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Lee una temperatura entera válida entre -50 y 60; confirma el valor leído.",
    inputDescription: "Un entero entre -50 y 60.",
    outputDescription: "Temperatura: N; si falla la conversión o el rango, Entrada invalida y retorno 1.",
    constraints: ["No uses el valor antes de validar scanf."],
    hints: ["scanf debe devolver 1.", "Valida el intervalo después de comprobar la conversión."],
    sourceC:
      "/* Registrar una temperatura\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int temperatura = 0;\n    /* TODO: lee temperatura con scanf y valida conversion/rango. */\n    /* TODO: imprime el valor solo despues de validarlo. */\n    (void)temperatura;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-03-termometro.c",
    tests: [
      {
        name: "Borde inferior",
        input: "-50\n",
        output: "Temperatura: -50\n",
      },
      {
        name: "Borde superior",
        input: "60\n",
        output: "Temperatura: 60\n",
      },
      {
        name: "Texto",
        input: "frio\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
      {
        name: "Fuera de rango",
        input: "61\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Lee una temperatura entera válida entre -50 y 60; confirma el valor leído.",
    why: "&t entrega una dirección donde scanf puede escribir; || evita leer t si la conversión falló.",
    trap: "Comparar una variable sin inicializar después de una conversión fallida.",
    teacher: "Pide distinguir error de formato y error de dominio.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué validas scanf antes de comparar el rango?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Comparar una variable sin inicializar después de una conversión fallida."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Conversión válida → dominio válido → cálculo → salida.",
    },
  },
  {
    id: "practica-03-intervalo",
    lessonId: "03-entrada",
    title: "Medir una variación de nivel",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Lee el nivel inicial y final de un tanque; informa la variación con signo.",
    inputDescription: "Dos enteros entre 0 y 1000, en orden inicial final.",
    outputDescription:
      "Variacion: final-inicial; Entrada invalida y retorno 1 si faltan números o salen del rango.",
    constraints: ["Un descenso debe conservar el signo negativo."],
    hints: [
      "Comprueba que scanf convierta 2 valores.",
      "El orden de la resta representa cambio, no distancia.",
    ],
    sourceC:
      "/* Medir una variación de nivel\n * Objetivo: Lee el nivel inicial y final de un tanque; informa la variación con signo.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Comprueba que scanf convierta2 valores. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-03-intervalo.c",
    tests: [
      {
        name: "Subida",
        input: "120 300\n",
        output: "Variacion: 180\n",
      },
      {
        name: "Descenso",
        input: "1000 0\n",
        output: "Variacion: -1000\n",
      },
      {
        name: "Sin cambio",
        input: "0 0\n",
        output: "Variacion: 0\n",
      },
      {
        name: "Dato incompleto",
        input: "20\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Lee el nivel inicial y final de un tanque; informa la variación con signo.",
    why: "Comprobar dos conversiones garantiza que ambos objetos contienen datos antes de restar.",
    trap: "Invertir la resta o eliminar el signo cambia el significado físico.",
    teacher: "Pide dibujar el antes y después y anticipar el signo.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué significa una variación negativa?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Invertir la resta o eliminar el signo cambia el significado físico."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Conversión válida → dominio válido → cálculo → salida.",
    },
  },
  {
    id: "practica-03-cajas",
    lessonId: "03-entrada",
    title: "Empacar unidades con divisor válido",
    difficulty: "Reto",
    minutes: 35,
    statement: "Lee unidades y capacidad de caja; informa cajas completas y unidades sobrantes.",
    inputDescription: "unidades entre 0 y 10000; capacidad entre 1 y 100.",
    outputDescription:
      "Completas: X y Sobrantes: Y en líneas separadas. Error: Entrada invalida y retorno 1.",
    constraints: ["Nunca dividas entre cero; valida ambos datos antes de calcular."],
    hints: [
      "La capacidad cero no tiene interpretación en este contrato.",
      "Usa / para cajas completas y % para unidades restantes.",
    ],
    sourceC:
      "/* Empacar unidades con divisor válido\n * Objetivo: Lee unidades y capacidad de caja; informa cajas completas y unidades sobrantes.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* La capacidad cero no tiene interpretación en este contrato. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-03-cajas.c",
    tests: [
      {
        name: "Con sobrante",
        input: "29 6\n",
        output: "Completas: 4\nSobrantes: 5\n",
      },
      {
        name: "Sin unidades",
        input: "0 5\n",
        output: "Completas: 0\nSobrantes: 0\n",
      },
      {
        name: "Reparto exacto",
        input: "10000 100\n",
        output: "Completas: 100\nSobrantes: 0\n",
      },
      {
        name: "Divisor cero",
        input: "20 0\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Lee unidades y capacidad de caja; informa cajas completas y unidades sobrantes.",
    why: "La validación protege la precondición de / y %: su segundo operando debe ser distinto de cero.",
    trap: "Validar después de calcular llega demasiado tarde para evitar la división inválida.",
    teacher: "Pide justificar por qué la capacidad mínima es 1.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué precondición protege la división y el residuo?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Validar después de calcular llega demasiado tarde para evitar la división inválida."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Conversión válida → dominio válido → cálculo → salida.",
    },
  },
];
