/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-06-perimetro",
    lessonId: "06-funciones",
    title: "Un marco hecho por una función",
    difficulty: "Inicio",
    minutes: 15,
    statement:
      "Implementa perimetro(base,altura) y úsala para calcular el largo total de un marco rectangular.",
    inputDescription: "Dos enteros base altura entre 1 y 1000.",
    outputDescription: "Perimetro: N. Error: Entrada invalida y retorno 1.",
    constraints: ["La función calcula y retorna; main lee, valida y muestra."],
    hints: [
      "El contrato de perimetro recibe dos dimensiones válidas.",
      "Retorna 2*(base+altura); no imprimas desde la función.",
    ],
    sourceC:
      "/* Un marco hecho por una función\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    int base = 0, altura = 0;\n    /* TODO: implementa una funcion perimetro antes de main. */\n    /* TODO: lee, valida y usa el retorno de esa funcion. */\n    (void)base; (void)altura;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-06-perimetro.c",
    tests: [
      {
        name: "Cuadrado unidad",
        input: "1 1\n",
        output: "Perimetro: 4\n",
      },
      {
        name: "Rectángulo",
        input: "8 3\n",
        output: "Perimetro: 22\n",
      },
      {
        name: "Máximo",
        input: "1000 1000\n",
        output: "Perimetro: 4000\n",
      },
      {
        name: "Lado cero",
        input: "0 5\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Implementa perimetro(base,altura) y úsala para calcular el largo total de un marco rectangular.",
    why: "Separar cálculo y entrada/salida permite reutilizar y probar la función con distintos argumentos.",
    trap: "Una función int necesita retornar el resultado; imprimirlo no equivale a devolverlo.",
    teacher: "Pide dibujar qué valores entran y cuál sale de la función.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cómo probarías perimetro sin leer datos del teclado?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Una función int necesita retornar el resultado; imprimirlo no equivale a devolverlo."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Contrato → argumentos por valor → cálculo → retorno.",
    },
  },
  {
    id: "practica-06-mcd",
    lessonId: "06-funciones",
    title: "Sincronizar dos señales",
    difficulty: "Aplicación",
    minutes: 25,
    statement:
      "Implementa una función de Euclides que calcule el máximo común divisor de dos períodos enteros.",
    inputDescription: "Dos enteros positivos de 1 a 1000000.",
    outputDescription: "MCD: N. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa módulo dentro de una función y conserva el segundo operando antes de reemplazarlo."],
    hints: [
      "La identidad mcd(a,b)=mcd(b,a%b) reduce el problema.",
      "Cuando b es 0, a contiene el resultado.",
    ],
    sourceC:
      "/* Sincronizar dos señales\n * Objetivo: Implementa una función de Euclides que calcule el máximo común divisor de dos períodos enteros.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* La identidad mcd(a,b)=mcd(b,a%b) reduce el problema. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-06-mcd.c",
    tests: [
      {
        name: "Divisor común",
        input: "48 18\n",
        output: "MCD: 6\n",
      },
      {
        name: "Coprimos",
        input: "17 13\n",
        output: "MCD: 1\n",
      },
      {
        name: "Mismo período",
        input: "1000000 1000000\n",
        output: "MCD: 1000000\n",
      },
      {
        name: "Período cero",
        input: "0 2\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Implementa una función de Euclides que calcule el máximo común divisor de dos períodos enteros.",
    why: "Los parámetros se copian: la función puede reducir sus copias sin cambiar las variables de main.",
    trap: "Sobrescribir a antes de calcular a%b usa un operando distinto.",
    teacher: "Pide trazar pares(a,b) y justificar que b disminuye.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué reemplazar (a,b) por (b,a%b) conserva el MCD?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Sobrescribir a antes de calcular a%b usa un operando distinto."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Contrato → argumentos por valor → cálculo → retorno.",
    },
  },
  {
    id: "practica-06-primos",
    lessonId: "06-funciones",
    title: "Contar identificadores primos",
    difficulty: "Reto",
    minutes: 35,
    statement: "Cuenta los números primos desde 1 hasta N usando una función es_primo que retorne 0 o 1.",
    inputDescription: "N entre 1 y 2000.",
    outputDescription: "Primos: cantidad. Error: Entrada invalida y retorno 1.",
    constraints: ["1 no es primo; separa clasificación y conteo."],
    hints: [
      "Un número menor que 2 no es primo.",
      "Basta comprobar divisores mientras d<=n/d, sin calcular d*d.",
    ],
    sourceC:
      "/* Contar identificadores primos\n * Objetivo: Cuenta los números primos desde 1 hastaN usando una función es_primo que retorne0 o1.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Un número menor que2 no es primo. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-06-primos.c",
    tests: [
      {
        name: "Sin primos",
        input: "1\n",
        output: "Primos: 0\n",
      },
      {
        name: "Primer primo",
        input: "2\n",
        output: "Primos: 1\n",
      },
      {
        name: "Primeros diez",
        input: "10\n",
        output: "Primos: 4\n",
      },
      {
        name: "Máximo",
        input: "2000\n",
        output: "Primos: 303\n",
      },
      {
        name: "Dominio inválido",
        input: "0\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Cuenta los números primos desde 1 hasta N usando una función es_primo que retorne 0 o 1.",
    why: "La función predicado expresa una propiedad y el ciclo exterior cuenta cuántos elementos la cumplen.",
    trap: "Considerar primo al 1 o detener los divisores antes de detectar un cuadrado perfecto.",
    teacher: "Pide usar 9 y 25 para refutar una prueba incompleta de divisibilidad.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué basta buscar divisores hasta n/d?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Considerar primo al 1 o detener los divisores antes de detectar un cuadrado perfecto."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Contrato → argumentos por valor → cálculo → retorno.",
    },
  },
];
