/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-02-reparto",
    lessonId: "02-tipos",
    title: "Repartir 73 fichas entre 6 equipos",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Calcula cuántas fichas enteras recibe cada equipo y cuántas quedan de reserva.",
    inputDescription: "Sin entrada:73 fichas y 6 equipos.",
    outputDescription: "Dos líneas: Por equipo:12 y Reserva:1.",
    constraints: ["Usa variables int, división y residuo; no codifiques los resultados como constantes."],
    hints: [
      "El cociente entero mide lotes completos.",
      "El residuo verifica fichas = equipos * cociente + reserva.",
    ],
    sourceC:
      "/* Repartir73 fichas entre 6 equipos\n * Objetivo: Calcula cuántas fichas enteras recibe cada equipo y cuántas quedan de reserva.\n */\n#include <stdio.h>\n\nint main(void) {\n    int fichas = 73, equipos = 6;\n    /* TODO: calcula e imprime cociente y residuo. */\n    (void)fichas; (void)equipos;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-02-reparto.c",
    tests: [
      {
        name: "Reparto fijo",
        input: "",
        output: "Por equipo: 12\nReserva: 1\n",
      },
    ],
    concept: "Calcula cuántas fichas enteras recibe cada equipo y cuántas quedan de reserva.",
    why: "La división entre int produce un cociente entero; el residuo permite conservar la cantidad total.",
    trap: "Convertir el cociente a double después de dividir no recupera la fracción.",
    teacher: "Pide justificar la identidad 73 =6*12+1.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cómo compruebas que cociente y residuo conservan las 73 fichas?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Convertir el cociente a double después de dividir no recupera la fracción."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Tipos de operandos → operación → valor almacenado → formato.",
    },
  },
  {
    id: "practica-02-reloj",
    lessonId: "02-tipos",
    title: "Convertir 7384 segundos",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Descompón una duración fija en horas, minutos restantes y segundos restantes.",
    inputDescription: "Sin entrada:7384 segundos.",
    outputDescription: "Una línea:2 h 3 min 4 s, con un espacio entre cada componente:2 h 3 min 4 s.",
    constraints: ["Los minutos y segundos de la salida deben quedar entre 0 y 59."],
    hints: [
      "Una hora contiene 3600 segundos.",
      "Obtén primero el resto tras quitar horas; divide ese resto entre 60.",
    ],
    sourceC:
      "/* Convertir7384 segundos\n * Objetivo: Descompón una duración fija en horas, minutos restantes y segundos restantes.\n */\n#include <stdio.h>\n\nint main(void) {\n    int total = 7384;\n    /* TODO: separa horas, minutos restantes y segundos. */\n    (void)total;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-02-reloj.c",
    tests: [
      {
        name: "Duración fija",
        input: "",
        output: "2 h 3 min 4 s\n",
      },
    ],
    concept: "Descompón una duración fija en horas, minutos restantes y segundos restantes.",
    why: "Cada cociente extrae una unidad y cada residuo conserva lo que falta convertir.",
    trap: "Usar total/60 como minutos restantes produce 123, no 3.",
    teacher: "Solicita reconstruir total =3600*h+60*m+s.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué quitas las horas antes de calcular los minutos restantes?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Usar total/60 como minutos restantes produce 123, no 3."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Tipos de operandos → operación → valor almacenado → formato.",
    },
  },
  {
    id: "practica-02-promedio",
    lessonId: "02-tipos",
    title: "Un promedio que conserva decimales",
    difficulty: "Reto",
    minutes: 35,
    statement: "Calcula el promedio de las notas fijas 17,14 y 18 y muéstralo con dos decimales.",
    inputDescription: "Sin entrada.",
    outputDescription: "Promedio:16.33 con un espacio después de los dos puntos.",
    constraints: ["Al menos un operando de la división debe ser real."],
    hints: [
      "La suma de las notas es entera; el divisor puede ser 3.0.",
      "printf usa %.2 f para mostrar dos decimales, sin cambiar el valor almacenado.",
    ],
    sourceC:
      "/* Un promedio que conserva decimales\n * Objetivo: Calcula el promedio de las notas fijas17,14 y18 y muéstralo con dos decimales.\n */\n#include <stdio.h>\n\nint main(void) {\n    int a = 17, b = 14, c = 18;\n    /* TODO: calcula un promedio real y muestra dos decimales. */\n    (void)a; (void)b; (void)c;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-02-promedio.c",
    tests: [
      {
        name: "Promedio no entero",
        input: "",
        output: "Promedio: 16.33\n",
      },
    ],
    concept: "Calcula el promedio de las notas fijas 17,14 y 18 y muéstralo con dos decimales.",
    why: "El tipo de los operandos determina la división antes de asignar a double; el formato controla la presentación.",
    trap: "double p=(a+b+c)/3 trunca el cociente antes de guardarlo.",
    teacher: "Compara la expresión con divisor 3 y 3.0.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿En qué momento se pierde la fracción si divides entre 3?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["double p=(a+b+c)/3 trunca el cociente antes de guardarlo."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Tipos de operandos → operación → valor almacenado → formato.",
    },
  },
];
