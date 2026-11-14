/* Prácticas originales de Aula C; dificultad relativa a este tema. */
export default [
  {
    id: "practica-13-registro",
    lessonId: "13-archivos",
    title: "Guardar y recuperar una lectura",
    difficulty: "Inicio",
    minutes: 15,
    statement:
      "Escribe una lectura en registro.txt, cierra el archivo y vuelve a abrirlo para comprobar lo almacenado.",
    inputDescription: "Una lectura entera de -1000 a 1000.",
    outputDescription: "Recuperado: N. Error de entrada: Entrada invalida y retorno 1.",
    constraints: [
      "El archivo es virtual y temporal en el navegador; valida fopen, fprintf, fscanf y fclose.",
    ],
    hints: [
      "Abre con w para escribir y cierra antes de abrir con r.",
      "fopen devuelve NULL si falla; fscanf debe convertir exactamente 1 dato.",
    ],
    sourceC:
      "/* Guardar y recuperar una lectura\n * Plantilla: completa los TODO sin mirar la solucion.\n */\n#include <stdio.h>\n\nint main(void) {\n    FILE *archivo = NULL;\n    int lectura = 0, recuperado = 0;\n    /* TODO: valida la entrada; abre para escritura y comprueba errores. */\n    /* TODO: cierra, vuelve a abrir para lectura y verifica el dato. */\n    (void)archivo; (void)lectura; (void)recuperado;\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-13-registro.c",
    tests: [
      {
        name: "Cero",
        input: "0\n",
        output: "Recuperado: 0\n",
      },
      {
        name: "Negativo",
        input: "-1000\n",
        output: "Recuperado: -1000\n",
      },
      {
        name: "Positivo",
        input: "1000\n",
        output: "Recuperado: 1000\n",
      },
      {
        name: "No numérico",
        input: "x\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Escribe una lectura en registro.txt, cierra el archivo y vuelve a abrirlo para comprobar lo almacenado.",
    why: "FILE* representa un flujo con estado y errores; cerrar confirma la escritura antes de recuperar el dato.",
    trap: "Suponer que el archivo virtual permanece entre ejecuciones o no comprobar fopen.",
    teacher: "Pide señalar cuándo el dato existe en memoria y cuándo se escribe al flujo.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Por qué cierras antes de abrir de nuevo para leer?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Suponer que el archivo virtual permanece entre ejecuciones o no comprobar fopen."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Abrir → comprobar → escribir/leer → comprobar → cerrar → comprobar.",
    },
  },
  {
    id: "practica-13-reporte",
    lessonId: "13-archivos",
    title: "Un reporte leído hasta el fin de archivo",
    difficulty: "Aplicación",
    minutes: 25,
    statement:
      "Guarda N mediciones en un archivo y vuelve a recorrerlo hasta EOF para calcular cantidad y suma.",
    inputDescription: "N entre 0 y 20; después N enteros de -1000 a 1000.",
    outputDescription:
      "Registros: N y Suma: total en dos líneas. Error de entrada: Entrada invalida y retorno 1.",
    constraints: ["Valida toda la entrada antes de escribir; distingue fin normal de error de lectura."],
    hints: [
      "El ciclo depende del resultado de fscanf, no de while(!feof(...)).",
      "Al terminar exige EOF y que ferror sea falso.",
    ],
    sourceC:
      "/* Un reporte leído hasta el fin de archivo\n * Objetivo: GuardaN mediciones en un archivo y vuelve a recorrerlo hasta EOF para calcular cantidad y suma.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* El ciclo depende del resultado de fscanf, no de while(!feof(...)). */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-13-reporte.c",
    tests: [
      {
        name: "Archivo vacío",
        input: "0\n",
        output: "Registros: 0\nSuma: 0\n",
      },
      {
        name: "Valores con signo",
        input: "3 -5 0 8\n",
        output: "Registros: 3\nSuma: 3\n",
      },
      {
        name: "Un registro",
        input: "1 1000\n",
        output: "Registros: 1\nSuma: 1000\n",
      },
      {
        name: "Entrada truncada",
        input: "2 8\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Guarda N mediciones en un archivo y vuelve a recorrerlo hasta EOF para calcular cantidad y suma.",
    why: "EOF se conoce después de intentar leer; la condición de conversión controla si el dato es válido para procesar.",
    trap: "while(!feof(archivo)) puede procesar otra vez el último dato tras fallar la lectura.",
    teacher: "Pide simular la lectura que descubre el fin del archivo.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿En qué intento de lectura se descubre el final del archivo?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["while(!feof(archivo)) puede procesar otra vez el último dato tras fallar la lectura."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Abrir → comprobar → escribir/leer → comprobar → cerrar → comprobar.",
    },
  },
  {
    id: "practica-13-csv",
    lessonId: "13-archivos",
    title: "Conciliar un archivo de ventas",
    difficulty: "Reto",
    minutes: 35,
    statement:
      "Genera ventas.csv con pares cantidad,precio y vuelve a leerlos para calcular el importe total en céntimos.",
    inputDescription: "N de 0 a 20; N pares cantidad precio. Cantidad 0..100, precio en céntimos 0..100000.",
    outputDescription: "Centimos: total. Error de entrada: Entrada invalida y retorno 1.",
    constraints: [
      "Cada fila CSV contiene dos enteros separados por coma; no hay cabecera.",
      "El total máximo es 200000000; los archivos se crean de nuevo en cada ejecución.",
    ],
    hints: [
      "Escribe con formato %d,%d\\n.",
      "Lee la coma literal con fscanf y acumula cantidad*precio por fila.",
    ],
    sourceC:
      "/* Conciliar un archivo de ventas\n * Objetivo: Genera ventas.csv con pares cantidad,precio y vuelve a leerlos para calcular el importe total en céntimos.\n */\n#include <stdio.h>\n\nint main(void) {\n    /* TODO: identifica entrada, proceso y salida antes de programar. */\n    /* Escribe con formato %d,%d\\n. */\n    /* TODO: implementa el contrato; esta plantilla aun no resuelve el problema. */\n    return 0;\n}\n",
    solutionPath: "lecciones/practicas/practica-13-csv.c",
    tests: [
      {
        name: "Sin ventas",
        input: "0\n",
        output: "Centimos: 0\n",
      },
      {
        name: "Dos ventas",
        input: "2 3 250 2 100\n",
        output: "Centimos: 950\n",
      },
      {
        name: "Cantidad máxima",
        input: "1 100 100000\n",
        output: "Centimos: 10000000\n",
      },
      {
        name: "Venta de cero unidades",
        input: "1 0 500\n",
        output: "Centimos: 0\n",
      },
      {
        name: "Precio inválido",
        input: "1 2 -1\n",
        output: "Entrada invalida\n",
        exitCode: 1,
      },
    ],
    concept:
      "Genera ventas.csv con pares cantidad,precio y vuelve a leerlos para calcular el importe total en céntimos.",
    why: "El formato persistido es un contrato distinto de la entrada: la coma es parte del CSV y debe leerse explícitamente.",
    trap: "Leer CSV con %d%d no consume la coma y detiene la conversión en la segunda columna.",
    teacher: "Pide separar errores de datos, del formato persistido y del flujo.",
    challenge:
      "Explica la solución sin mirar el código y diseña un caso adicional que pueda detectar un error.",
    teacherDetails: {
      questions: [
        "¿Qué ocurre si lees una coma con el formato %d%d?",
        "¿Qué caso de prueba distingue una solución correcta de una que solo parece funcionar?",
      ],
      blindspots: ["Leer CSV con %d%d no consume la coma y detiene la conversión en la segunda columna."],
      rubric: [
        "Respeta el contrato de entrada y salida.",
        "Justifica cada condición, tipo y límite.",
        "Traza un caso normal y otro límite antes de ejecutar.",
      ],
      blackboard: "Abrir → comprobar → escribir/leer → comprobar → cerrar → comprobar.",
    },
  },
];
