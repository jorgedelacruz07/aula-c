/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-14-pila",
    lessonId: "14-listas",
    title: "Apilar tarjetas al inicio",
    difficulty: "Inicio",
    minutes: 15,
    statement: "Crea una lista enlazada insertando cada tarjeta al inicio y muestra el orden final.",
    inputDescription: "N de 0 a 20; después N enteros de -1000 a 1000.",
    outputDescription:
      "Valores de la lista separados por espacios; Vacio si N=0. Error: Entrada invalida y retorno 1.",
    constraints: ["Cada nodo es una reserva independiente; libera toda la lista al terminar y ante error."],
    hints: ["El nuevo nodo apunta a la cabeza anterior.", "Solo después de enlazarlo actualiza la cabeza."],
    sourceC:
      "/* Apilar tarjetas al inicio\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    struct Nodo { int dato; struct Nodo *siguiente; };\n    struct Nodo *cabeza = NULL;\n    /* TODO: construye nodos enlazados al inicio y muestra la cadena. */\n    /* TODO: guarda el siguiente enlace antes de liberar cada nodo. */\n    (void)cabeza;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-14-pila.c",
    tests: [
      {
        name: "Sin tarjetas",
        input: "0\n",
        output: "Vacio\n",
      },
      {
        name: "Tres tarjetas",
        input: "3 4 8 2\n",
        output: "2 8 4\n",
      },
      {
        name: "Una tarjeta",
        input: "1 -1000\n",
        output: "-1000\n",
      },
      {
        name: "Error tras reservar",
        input: "2 5 x\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Crea una lista enlazada insertando cada tarjeta al inicio y muestra el orden final.",
    why: "Insertar al inicio invierte el orden de llegada; los enlaces deben guardarse antes de reemplazar la cabeza.",
    trap: "Actualizar cabeza antes de asignar nuevo->siguiente puede crear un ciclo sobre el mismo nodo.",
    teacher: "Pide dibujar la lista después de cada inserción.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué insertar al inicio invierte el orden?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: [
        "Actualizar cabeza antes de asignar nuevo->siguiente puede crear un ciclo sobre el mismo nodo.",
      ],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Cabeza → nodo → siguiente → NULL; guardar enlaces antes de liberar.",
    },
  },
  {
    id: "practica-14-cola",
    lessonId: "14-listas",
    title: "Respetar el orden de una fila",
    difficulty: "Aplicación",
    minutes: 25,
    statement: "Crea una lista enlazada insertando al final para conservar el orden de llegada.",
    inputDescription: "N de 0 a 20; después N enteros de -1000 a 1000.",
    outputDescription:
      "Valores en el orden de llegada, separados por espacios; Vacio si N=0. Error: Entrada invalida y retorno 1.",
    constraints: ["Mantén cabeza y cola; inicializa siguiente=NULL para cada nuevo último nodo."],
    hints: [
      "Si la lista está vacía, cabeza también debe apuntar al nuevo nodo.",
      "En caso contrario enlaza cola->siguiente y luego actualiza cola.",
    ],
    sourceC:
      "/* Respetar el orden de una fila\n * Objetivo: Crea una lista enlazada insertando al final para conservar el orden de llegada.\n */\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Si la lista está vacía, cabeza también debe apuntar al nuevo nodo. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-14-cola.c",
    tests: [
      {
        name: "Fila vacía",
        input: "0\n",
        output: "Vacio\n",
      },
      {
        name: "Llegadas",
        input: "4 3 1 3 9\n",
        output: "3 1 3 9\n",
      },
      {
        name: "Uno",
        input: "1 0\n",
        output: "0\n",
      },
      {
        name: "Dato ausente",
        input: "2 7\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept: "Crea una lista enlazada insertando al final para conservar el orden de llegada.",
    why: "Un puntero a la cola permite anexar en tiempo constante; cabeza conserva la propiedad de toda la cadena.",
    trap: "Olvidar siguiente=NULL deja un enlace indeterminado que el recorrido intentará seguir.",
    teacher: "Compara el orden de salida con insertar al inicio.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué invariante mantiene cola tras cada inserción?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Olvidar siguiente=NULL deja un enlace indeterminado que el recorrido intentará seguir."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Cabeza → nodo → siguiente → NULL; guardar enlaces antes de liberar.",
    },
  },
  {
    id: "practica-14-eliminar",
    lessonId: "14-listas",
    title: "Retirar todos los turnos cancelados",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Construye una lista en orden de llegada y elimina todos los nodos cuyo valor coincida con un código cancelado.",
    inputDescription:
      "N de 0 a 20; N enteros de -1000 a 1000; después el código a eliminar, del mismo rango.",
    outputDescription:
      "Valores restantes en su orden original, separados por espacios; Vacio si no queda ninguno. Error: Entrada invalida y retorno 1.",
    constraints: [
      "Libera cada nodo retirado y conserva correctamente la cabeza, incluso si hay varias cancelaciones consecutivas.",
    ],
    hints: [
      "Un puntero al enlace que apunta al nodo permite tratar igual cabeza y enlaces interiores.",
      "Al eliminar, reemplaza el enlace por el siguiente y libera el nodo; al conservar, avanza al enlace siguiente.",
    ],
    sourceC:
      "/* Retirar todos los turnos cancelados\n * Objetivo: Construye una lista en orden de llegada y elimina todos los nodos cuyo valor coincida con un código cancelado.\n */\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Un puntero al enlace que apunta al nodo permite tratar igual cabeza y enlaces interiores. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-14-eliminar.c",
    tests: [
      {
        name: "Cabeza y consecutivos",
        input: "6 2 2 5 2 7 2 2\n",
        output: "5 7\n",
      },
      {
        name: "Todos cancelados",
        input: "3 4 4 4 4\n",
        output: "Vacio\n",
      },
      {
        name: "Ningún cancelado",
        input: "3 1 2 3 9\n",
        output: "1 2 3\n",
      },
      {
        name: "Lista vacía",
        input: "0 5\n",
        output: "Vacio\n",
      },
      {
        name: "Falta código",
        input: "1 3\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Construye una lista en orden de llegada y elimina todos los nodos cuyo valor coincida con un código cancelado.",
    why: "Modificar el enlace entrante evita casos especiales para la cabeza y permite retirar varios nodos consecutivos sin perder el recorrido.",
    trap: "Leer actual->siguiente después de free(actual) usa memoria cuya duración ya terminó.",
    teacher: "Pide explicar el tipo struct Nodo** y dibujar qué enlace cambia en cada eliminación.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué enlace cambia al eliminar la cabeza o un nodo interior?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Leer actual->siguiente después de free(actual) usa memoria cuya duración ya terminó."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Cabeza → nodo → siguiente → NULL; guardar enlaces antes de liberar.",
    },
  },
];
