/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-04-entrada",
    lessonId: "04-decisiones",
    title: "Tarifa de una exposición",
    difficulty: "Inicio",
    minutes: 15,
    statement:
      "Clasifica la entrada por edad: menor de 6 gratis; 6 a 17 escolar; 18 a 64 general; 65 o más senior.",
    inputDescription: "Edad entera entre 0 y 120.",
    outputDescription: "Gratis, Escolar, General o Senior. Error: Entrada invalida y retorno 1.",
    constraints: ["Cada edad válida pertenece a una única categoría."],
    hints: ["Ordena los cortes de menor a mayor.", "Una cadena if/else if evita imprimir varias categorías."],
    sourceC:
      "/* Tarifa de una exposición\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int edad = 0;\n    /* TODO: lee y valida edad. */\n    /* TODO: ordena los cortes y elige una unica categoria. */\n    (void)edad;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-04-entrada.c",
    tests: [
      {
        name: "Antes del corte",
        input: "5\n",
        output: "Gratis\n",
      },
      {
        name: "Inicio escolar",
        input: "6\n",
        output: "Escolar\n",
      },
      {
        name: "Mayoría de edad",
        input: "18\n",
        output: "General\n",
      },
      {
        name: "Inicio senior",
        input: "65\n",
        output: "Senior\n",
      },
      {
        name: "Edad inválida",
        input: "-1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Clasifica la entrada por edad: menor de 6 gratis; 6 a 17 escolar; 18 a 64 general; 65 o más senior.",
    why: "Las ramas ordenadas permiten expresar intervalos sin repetir todas las condiciones.",
    trap: "Usar <=18 para Escolar clasifica mal el límite 18.",
    teacher: "Pide construir pruebas justo antes y después de cada corte.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿A qué categoría pertenecen exactamente las edades 6, 18 y 65?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Usar <=18 para Escolar clasifica mal el límite 18."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Datos → condición → rama única → pruebas en las fronteras.",
    },
  },
  {
    id: "practica-04-envio",
    lessonId: "04-decisiones",
    title: "Costo de envío por tramos",
    difficulty: "Aplicación",
    minutes: 25,
    statement:
      "Calcula una tarifa en céntimos: primer kilómetro 500; del 2 al 10 suma 200 por km; desde el 11 suma 150 por km adicional.",
    inputDescription: "Distancia entera de 1 a 100 kilómetros.",
    outputDescription: "Centimos: N; error: Entrada invalida y retorno 1.",
    constraints: ["Tarifa acumulada por tramos, no una tarifa única para toda la distancia."],
    hints: ["Hasta 10 km:500+200*(km-1).", "A partir de 11 conserva lo cobrado por los primeros 10 km."],
    sourceC:
      "/* Costo de envío por tramos\n * Objetivo: Calcula una tarifa en céntimos: primer kilómetro500; del2 al10 suma200 por km; desde el 11 suma150 por km adicional.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Hasta10 km:500+200*(km-1). */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-04-envio.c",
    tests: [
      {
        name: "Primer tramo",
        input: "1\n",
        output: "Centimos: 500\n",
      },
      {
        name: "Fin del segundo tramo",
        input: "10\n",
        output: "Centimos: 2300\n",
      },
      {
        name: "Cambio de tramo",
        input: "11\n",
        output: "Centimos: 2450\n",
      },
      {
        name: "Máximo",
        input: "100\n",
        output: "Centimos: 15800\n",
      },
      {
        name: "Distancia cero",
        input: "0\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Calcula una tarifa en céntimos: primer kilómetro 500; del 2 al 10 suma 200 por km; desde el 11 suma 150 por km adicional.",
    why: "Separar por tramos conserva el costo ya acumulado y hace visibles los límites.",
    trap: "Multiplicar toda la distancia por 150 al pasar de 10 km reduce incorrectamente la tarifa.",
    teacher: "Pide comprobar continuidad discreta entre 10 y 11 kilómetros.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué conservas el costo de los primeros 10 km?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "Multiplicar toda la distancia por 150 al pasar de 10 km reduce incorrectamente la tarifa.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Datos → condición → rama única → pruebas en las fronteras.",
    },
  },
  {
    id: "practica-04-bisiesto",
    lessonId: "04-decisiones",
    title: "¿Se abre el 29 de febrero?",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Determina si un año del calendario gregoriano es bisiesto: divisible por 400 o divisible por 4 pero no por 100.",
    inputDescription: "Año entero entre 1583 y 9999.",
    outputDescription: "Bisiesto o Comun. Error: Entrada invalida y retorno 1.",
    constraints: ["Implementa ambas excepciones de los años de siglo."],
    hints: [
      "Comprueba primero el caso divisible por 400.",
      "Agrupa las condiciones con paréntesis para explicar el criterio.",
    ],
    sourceC:
      "/* ¿Se abre el 29 de febrero?\n * Objetivo: Determina si un año del calendario gregoriano es bisiesto: divisible por 400 o divisible por 4 pero no por 100.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Comprueba primero el caso divisible por 400. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-04-bisiesto.c",
    tests: [
      {
        name: "Siglo común",
        input: "1900\n",
        output: "Comun\n",
      },
      {
        name: "Siglo bisiesto",
        input: "2000\n",
        output: "Bisiesto\n",
      },
      {
        name: "Múltiplo de4",
        input: "2024\n",
        output: "Bisiesto\n",
      },
      {
        name: "Año común",
        input: "2025\n",
        output: "Comun\n",
      },
      {
        name: "Fuera del calendario",
        input: "1500\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Determina si un año del calendario gregoriano es bisiesto: divisible por 400 o divisible por 4 pero no por 100.",
    why: "Los conectores || y && combinan criterios; el residuo cero representa divisibilidad.",
    trap: "Considerar bisiesto cualquier múltiplo de 4 falla en 1900.",
    teacher: "Pide un contraejemplo a la regla simplificada de cuatro años.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué caso refuta que todo múltiplo de 4 sea bisiesto?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Considerar bisiesto cualquier múltiplo de 4 falla en 1900."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Datos → condición → rama única → pruebas en las fronteras.",
    },
  },
];
