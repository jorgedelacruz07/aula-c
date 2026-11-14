/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-12-punto",
    lessonId: "12-estructuras",
    title: "Recorrer cuadras entre dos puntos",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Modela dos puntos con struct y calcula su distancia Manhattan: |x 2-x 1|+|y 2-y 1|.",
    inputDescription: "Cuatro enteros x 1 y 1 x 2 y 2, cada uno entre -1000 y 1000.",
    outputDescription: "Cuadras: N. Error: Entrada invalida y retorno 1.",
    constraints: ["Usa una estructura Punto con campos x,y; no distancia euclidiana."],
    hints: [
      "Agrupa coordenadas que pertenecen al mismo punto.",
      "abs recibe diferencias seguras dentro del dominio acotado.",
    ],
    sourceC:
      "/* Recorrer cuadras entre dos puntos\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    struct Punto { int x, y; };\n    struct Punto a = {0, 0}, b = {0, 0};\n    /* TODO: lee y valida las coordenadas de ambos puntos. */\n    /* TODO: calcula la distancia Manhattan usando sus campos. */\n    (void)a; (void)b;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-12-punto.c",
    tests: [
      {
        name: "Mismo punto",
        input: "2 3 2 3\n",
        output: "Cuadras: 0\n",
      },
      {
        name: "Cruzar ejes",
        input: "-2 4 3 -1\n",
        output: "Cuadras: 10\n",
      },
      {
        name: "Esquinas máximas",
        input: "-1000 -1000 1000 1000\n",
        output: "Cuadras: 4000\n",
      },
      {
        name: "Dato inválido",
        input: "1 2 3 x\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Modela dos puntos con struct y calcula su distancia Manhattan: |x 2-x 1|+|y 2-y 1|.",
    why: "Una estructura agrupa campos de una entidad; el operador punto selecciona un campo del objeto.",
    trap: "Confundir el nombre del tipo con un objeto concreto o usar la fórmula de distancia equivocada.",
    teacher: "Pide explicar por qué cada par de coordenadas forma una entidad.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué agrupar las coordenadas aclara el modelo?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "Confundir el nombre del tipo con un objeto concreto o usar la fórmula de distancia equivocada.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Entidad → campos relacionados → comparación → registro elegido.",
    },
  },
  {
    id: "practica-12-beca",
    lessonId: "12-estructuras",
    title: "Elegir una postulación",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Modela postulantes con código y nota; elige la mayor nota y, en empate, el menor código.",
    inputDescription:
      "N de 1 a 20; N pares código nota. Código de 1 a 999; nota de 0 a 20. Se admiten códigos repetidos.",
    outputDescription: "Elegido: codigo nota. Error: Entrada invalida y retorno 1.",
    constraints: ["Guarda los registros completos en un arreglo de estructuras."],
    hints: ["Compara nota primero.", "En empate de nota, compara el código como segundo criterio."],
    sourceC:
      "/* Elegir una postulación\n * Objetivo: Modela postulantes con código y nota; elige la mayor nota y, en empate, el menor código.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Compara nota primero. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-12-beca.c",
    tests: [
      {
        name: "Desempate",
        input: "3 40 18 20 18 1 15\n",
        output: "Elegido: 20 18\n",
      },
      {
        name: "Uno",
        input: "1 999 0\n",
        output: "Elegido: 999 0\n",
      },
      {
        name: "Mayor nota",
        input: "3 2 10 7 20 1 19\n",
        output: "Elegido: 7 20\n",
      },
      {
        name: "Nota imposible",
        input: "1 2 21\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Modela postulantes con código y nota; elige la mayor nota y, en empate, el menor código.",
    why: "Un criterio compuesto define un orden por nota y código sin separar campos relacionados.",
    trap: "Actualizar solo la nota máxima y olvidar conservar el código del mismo postulante.",
    teacher: "Pide dos conjuntos que distingan el criterio principal del desempate.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Cómo distingues el criterio principal del desempate?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Actualizar solo la nota máxima y olvidar conservar el código del mismo postulante."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Entidad → campos relacionados → comparación → registro elegido.",
    },
  },
  {
    id: "practica-12-stock",
    lessonId: "12-estructuras",
    title: "Atender un pedido de almacén",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Carga un inventario de códigos únicos y procesa un pedido: informa stock restante, insuficiencia o código inexistente.",
    inputDescription:
      "N de 1 a 10; N pares código stock; luego código_pedido cantidad. Códigos 1..999, stock 0..1000, cantidad 1..1000.",
    outputDescription:
      "Stock: restante, Insuficiente o No existe. Error: Entrada invalida y retorno 1 por datos fuera del dominio, incompletos o códigos duplicados.",
    constraints: ["Busca por código, no por posición; no descuentes si el pedido supera el stock."],
    hints: [
      "Valida unicidad contra los registros ya leídos.",
      "Separa búsqueda, disponibilidad y actualización.",
    ],
    sourceC:
      "/* Atender un pedido de almacén\n * Objetivo: Carga un inventario de códigos únicos y procesa un pedido: informa stock restante, insuficiencia o código inexistente.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Valida unicidad contra los registros ya leídos. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-12-stock.c",
    tests: [
      {
        name: "Pedido exacto",
        input: "2 20 8 10 3 20 8\n",
        output: "Stock: 0\n",
      },
      {
        name: "Sin stock suficiente",
        input: "1 10 3 10 4\n",
        output: "Insuficiente\n",
      },
      {
        name: "Código desconocido",
        input: "1 10 3 20 1\n",
        output: "No existe\n",
      },
      {
        name: "Descuento parcial",
        input: "1 99 1000 99 2\n",
        output: "Stock: 998\n",
      },
      {
        name: "Duplicados",
        input: "2 5 3 5 8 5 1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Carga un inventario de códigos únicos y procesa un pedido: informa stock restante, insuficiencia o código inexistente.",
    why: "La estructura mantiene unido el identificador con su estado; el contrato impide stocks negativos y códigos ambiguos.",
    trap: "Usar un código como índice del arreglo sin buscarlo ni validar límites.",
    teacher: "Pide identificar la precondición que protege la resta del stock.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué condición evita un stock negativo?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Usar un código como índice del arreglo sin buscarlo ni validar límites."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Entidad → campos relacionados → comparación → registro elegido.",
    },
  },
];
