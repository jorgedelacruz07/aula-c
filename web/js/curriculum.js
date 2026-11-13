export const lessons = [
  {
    id: "01-hola",
    title: "Tu primer programa",
    level: "Básico",
    topic: "Fundamentos",
    minutes: 15,
    concept:
      "Un programa es una secuencia de instrucciones. Antes de ejecutarlo, el preprocesador incorpora declaraciones, el compilador traduce C y el enlazador une las funciones necesarias. main es el punto de entrada de este programa.",
    why: "La biblioteca stdio.h declara printf. El tipo int de main expresa un código de salida para el entorno: 0 comunica éxito. El texto entre comillas es una cadena y \\n representa un salto de línea.",
    trap: "Un ; termina una instrucción; no se coloca después de la cabecera de main. Los comentarios explican intención y no se ejecutan.",
    teacher:
      "Pide al alumno predecir cuántas líneas aparecerán. Después elimina un punto y coma y lee con él el primer diagnóstico del compilador.",
    challenge: "Imprime tu nombre en una segunda línea. Explica qué cambia al quitar \\n.",
    path: "lecciones/01-hola.c",
    symbols: ["#include", "()", "{}", ";", '""', "\\n"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "Hola, C!\n",
      },
    ],
  },
  {
    id: "02-tipos",
    title: "Variables y división entera",
    level: "Básico",
    topic: "Datos y operadores",
    minutes: 25,
    concept:
      "Una variable es un objeto con un tipo y un valor. int representa enteros y double aproximaciones de números reales. El tipo de los operandos determina la operación antes de asignar el resultado.",
    why: "7 / 2 produce 3 porque ambos operandos son int. En 7.0 / 2 hay conversión a double y el resultado es 3.5. El operador % obtiene el residuo entero; ayuda a extraer cifras y comprobar divisibilidad.",
    trap: "Guardar 7 / 2 en double no recupera la parte decimal perdida. Tampoco hay que asumir que int mide siempre cuatro bytes.",
    teacher:
      "Antes de ejecutar, pregunta por los tres resultados. Usa 8 y 3 como segundo ejemplo y exige una justificación basada en tipos.",
    challenge: "Calcula el promedio de tres notas enteras sin truncar la fracción.",
    path: "lecciones/02-tipos.c",
    symbols: ["=", "/", "%", "%d", "%.2f", "(tipo)"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "Entera: 3\nReal: 3.50\nResiduo: 1\n",
      },
    ],
  },
  {
    id: "03-entrada",
    title: "Leer y validar datos",
    level: "Básico",
    topic: "Entrada y salida",
    minutes: 30,
    concept:
      "scanf intenta convertir texto a valores y devuelve cuántas conversiones consiguió. Un dato solo se usa después de comprobar tanto la conversión como su dominio. La entrada del laboratorio se entrega completa antes de ejecutar.",
    why: 'En scanf("%d", &edad), %d solicita un int y &edad entrega su dirección: la biblioteca necesita escribir en ese objeto. Para double, scanf usa %lf; printf usa %f por reglas diferentes de estas funciones.',
    trap: "Nunca pases edad donde se requiere &edad. Si scanf falla y usas una variable sin inicializar, el comportamiento puede ser indefinido.",
    teacher:
      "Prueba 20, -1 y una palabra. Pregunta por qué la validación de conversión debe ocurrir antes de comparar el rango.",
    challenge: "Lee dos enteros, comprueba que scanf devuelva 2 y muestra su suma.",
    path: "lecciones/03-entrada.c",
    symbols: ["&", "%d", "!=", "||"],
    tests: [
      {
        name: "Caso de referencia",
        input: "20\n",
        output: "Edad: 20\n",
      },
      {
        name: "Edad negativa",
        input: "-1\n",
        output: "Edad invalida\n",
        exitCode: 1,
      },
      {
        name: "Entrada no numérica",
        input: "hola\n",
        output: "Edad invalida\n",
        exitCode: 1,
      },
    ],
  },
  {
    id: "04-decisiones",
    title: "Decidir con condiciones",
    level: "Básico",
    topic: "Control de flujo",
    minutes: 25,
    concept:
      "if evalúa una expresión: cero es falso y cualquier otro valor es verdadero. else pertenece al if correspondiente. Los operadores relacionales producen 0 o 1; && exige que ambas condiciones sean verdaderas.",
    why: "Para describir un intervalo escribe comparaciones completas: nota >= 0 && nota <= 20. == compara igualdad; = asigna y también produce un valor, por eso confundirlos puede compilar.",
    trap: "0 <= nota <= 20 no expresa un intervalo en C: primero se calcula 0 <= nota y ese 0 o 1 se compara con 20.",
    teacher:
      "Dibuja las ramas y prueba los bordes 0, 10, 11, 20 y 21. Pide distinguir casos válidos de casos aprobados.",
    challenge: "Añade una categoría de destacado para notas desde 17.",
    path: "lecciones/04-decisiones.c",
    symbols: ["if / else", "==", "&&", "||"],
    tests: [
      {
        name: "Caso de referencia",
        input: "11\n",
        output: "Aprobado\n",
      },
      {
        name: "Límite inferior",
        input: "0\n",
        output: "Por reforzar\n",
      },
      {
        name: "Fuera del dominio",
        input: "21\n",
        output: "Fuera de rango\n",
      },
    ],
  },
  {
    id: "05-ciclos",
    title: "Repetir con un invariante",
    level: "Básico",
    topic: "Ciclos",
    minutes: 35,
    concept:
      "Un ciclo necesita inicialización, condición y progreso. Un invariante describe lo que sigue siendo cierto entre vueltas. Aquí suma contiene 1 + ... + (i - 1) al empezar cada iteración.",
    why: "while evalúa la condición antes de entrar. i++ avanza el contador. for reúne inicialización, condición y actualización; ambos son parte de C, aunque un curso puede limitar su uso.",
    trap: "Un punto y coma inmediatamente después de while crea un cuerpo vacío. Un acumulador no inicializado no tiene un cero implícito.",
    teacher:
      "Traza i y suma en papel para n=3. Después pregunta qué ocurre con n=0 y por qué el ciclo termina.",
    challenge: "Calcula la suma de los pares de 1 a n. Mantén un límite para evitar desbordamiento.",
    path: "lecciones/05-ciclos.c",
    symbols: ["while", "++", "+=", "<="],
    tests: [
      {
        name: "Caso de referencia",
        input: "5\n",
        output: "Suma: 15\n",
      },
      {
        name: "Cero iteraciones",
        input: "0\n",
        output: "Suma: 0\n",
      },
      {
        name: "Límite del dominio",
        input: "200\n",
        output: "Suma: 20100\n",
      },
    ],
  },
  {
    id: "06-funciones",
    title: "Dividir el problema en funciones",
    level: "Intermedio",
    topic: "Modularidad",
    minutes: 35,
    concept:
      "Una función tiene un contrato: datos que recibe, precondiciones y resultado. El prototipo permite comprobar una llamada antes de ver la definición. En C todos los argumentos se pasan por valor.",
    why: "La función cuadrado recibe una copia del entero. return devuelve un resultado al llamador. main coordina la lectura y la presentación sin mezclar esos detalles con el cálculo.",
    trap: "Cambiar un parámetro int dentro de una función no cambia el objeto original del llamador. Una función no debe devolver una dirección a una variable local que ya dejó de existir.",
    teacher:
      "Pide escribir primero el contrato de cuadrado y después su implementación. Comprueba 0, negativos y el máximo aceptado.",
    challenge: "Extrae la validación a otra función que devuelva 0 o 1.",
    path: "lecciones/06-funciones.c",
    symbols: ["prototipo", "return", "()", "*"],
    tests: [
      {
        name: "Caso de referencia",
        input: "7\n",
        output: "Cuadrado: 49\n",
      },
      {
        name: "Negativo",
        input: "-7\n",
        output: "Cuadrado: 49\n",
      },
    ],
  },
  {
    id: "07-punteros",
    title: "Direcciones y objetos",
    level: "Intermedio",
    topic: "Memoria",
    minutes: 45,
    concept:
      "Un puntero almacena una dirección. & obtiene la dirección de un objeto; * accede al objeto apuntado. En int *p, el asterisco forma parte del declarador del puntero; en *p = 9 es una operación de indirección.",
    why: "Para modificar dos variables del llamador se pasan copias de sus direcciones. Esto se suele llamar paso por referencia en clase, pero el mecanismo de C sigue siendo paso por valor de punteros.",
    trap: "No desreferencies un puntero no inicializado o NULL. *p++ avanza el puntero; (*p)++ incrementa el valor. El orden depende de la precedencia.",
    teacher:
      "Dibuja dos cajas a y b, luego dos flechas. Explica qué se copia al entrar a intercambiar y qué objeto cambia con *a.",
    challenge: "Escribe una función que entregue suma y producto mediante dos parámetros puntero.",
    path: "lecciones/07-punteros.c",
    symbols: ["&", "*", "(*p)++", "NULL"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "x=8 y=3\n",
      },
    ],
  },
  {
    id: "08-arreglos",
    title: "Arreglos, índices y límites",
    level: "Intermedio",
    topic: "Colecciones",
    minutes: 40,
    concept:
      "Un arreglo contiene objetos contiguos del mismo tipo. Los índices van de 0 a longitud - 1. C no comprueba automáticamente si un índice está dentro del arreglo.",
    why: "notas[i] selecciona un elemento. sizeof notas / sizeof notas[0] obtiene la cantidad cuando notas es realmente un arreglo en ese ámbito. Al pasar un arreglo a una función debes entregar también su longitud.",
    trap: "i <= longitud visita una posición fuera del arreglo. Dentro de una función, sizeof sobre el parámetro ajustado a puntero no recupera el tamaño del arreglo original.",
    teacher:
      "Traza cada índice y explica por qué la condición usa <. Compara el límite académico sin arreglos con lo que sí permite el lenguaje.",
    challenge: "Encuentra la nota máxima recorriendo el arreglo una sola vez.",
    path: "lecciones/08-arreglos.c",
    symbols: ["[]", "sizeof", "for", "<"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "Promedio: 15.0\n",
      },
    ],
  },
  {
    id: "09-cadenas",
    title: "Texto y el terminador nulo",
    level: "Intermedio",
    topic: "Colecciones",
    minutes: 40,
    concept:
      "Una cadena C es un arreglo de char que termina en el carácter de valor cero, escrito \\0. No es lo mismo que el dígito 0 ni que un puntero NULL.",
    why: "char nombre[16] reserva espacio para 15 caracteres y el terminador. fgets limita la lectura al tamaño del búfer e incluye el salto de línea si cabe. El ejemplo elimina ese salto antes de imprimir.",
    trap: 'Nunca uses gets. scanf("%s", nombre) sin límite puede escribir fuera del búfer. La cantidad de bytes de UTF-8 puede diferir del número de letras visibles.',
    teacher:
      "Dibuja el arreglo para Ana y marca el terminador. Explica por qué hacen falta cuatro posiciones para tres letras.",
    challenge: "Cuenta las vocales ASCII de la cadena sin recorrer después de \\0.",
    path: "lecciones/09-cadenas.c",
    symbols: ["\\0", "[]", "%s", "NULL"],
    tests: [
      {
        name: "Caso de referencia",
        input: "Ana\n",
        output: "Hola, Ana\n",
      },
    ],
  },
  {
    id: "10-recursion",
    title: "Recursión y pila de llamadas",
    level: "Avanzado",
    topic: "Algoritmos",
    minutes: 45,
    concept:
      "Una función recursiva se llama a sí misma con un problema menor. Necesita un caso base y un argumento que avance hacia él. Cada llamada pendiente ocupa recursos de la pila.",
    why: "factorial(4) necesita 4 * factorial(3), y así hasta factorial(0). El retorno reconstruye los resultados. La recursión resulta natural para árboles, pero no reemplaza siempre a un ciclo.",
    trap: "La recursión sin caso base agota la pila. Aunque double amplíe el rango, pierde exactitud para enteros grandes. Este ejemplo limita n a 10.",
    teacher:
      "Dibuja las llamadas pendientes y luego sus retornos. Compara espacio y tiempo con un factorial iterativo.",
    challenge: "Implementa la versión iterativa y compara ambos resultados entre 0 y 10.",
    path: "lecciones/10-recursion.c",
    symbols: ["return", "==", "-", "()"],
    tests: [
      {
        name: "Caso de referencia",
        input: "5\n",
        output: "Factorial: 120\n",
      },
      {
        name: "Caso base",
        input: "0\n",
        output: "Factorial: 1\n",
      },
    ],
  },
  {
    id: "11-memoria",
    title: "Reservar y liberar memoria",
    level: "Avanzado",
    topic: "Memoria",
    minutes: 50,
    concept:
      "Los objetos locales tienen una duración acotada al bloque. malloc reserva almacenamiento cuya duración controlas con free. La propiedad de esa reserva debe quedar clara: quién la usa y quién la libera.",
    why: "malloc devuelve NULL si no puede reservar. sizeof *valores calcula el tamaño de cada elemento a partir del tipo apuntado. No es necesario convertir explícitamente el resultado de malloc en C.",
    trap: "Después de free no puedes leer ni liberar otra vez el mismo objeto. Si varias variables guardan la dirección, poner una en NULL no invalida mágicamente las demás.",
    teacher:
      "Haz seguir al alumno cada ruta de salida y comprobar si queda memoria sin liberar. Explica la diferencia entre tamaño y duración.",
    challenge:
      "Lee una cantidad entre 1 y 100 y reserva ese número de enteros; libera también en las rutas de error.",
    path: "lecciones/11-memoria.c",
    symbols: ["sizeof", "*", "NULL", "[]"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "Suma: 60\n",
      },
    ],
  },
  {
    id: "12-estructuras",
    title: "Modelar datos con struct",
    level: "Avanzado",
    topic: "Estructuras de datos",
    minutes: 45,
    concept:
      "struct agrupa miembros con tipos diferentes en un solo objeto. Permite modelar entidades y diseñar interfaces que expresen el dominio. El acceso a un miembro usa . en un objeto y -> en un puntero a estructura.",
    why: "Una estructura se puede pasar por valor, creando una copia, o mediante un puntero para evitar esa copia o modificarla. const en el tipo apuntado impide modificar ese objeto mediante ese acceso.",
    trap: "El tamaño de una estructura puede incluir relleno por alineación: no sumes tamaños de campos para adivinar sizeof. Un puntero a estructura también debe apuntar a un objeto válido.",
    teacher:
      "Pide explicar alumno.nota y p->nota con el mismo dibujo. Diseña un contrato para cambiar una nota válida.",
    challenge: "Crea una función que reciba const struct Alumno * y determine si está aprobado.",
    path: "lecciones/12-estructuras.c",
    symbols: ["struct", ".", "->", "const"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "Alumno 101: 17.0\n",
      },
    ],
  },
  {
    id: "13-archivos",
    title: "Archivos y errores de E/S",
    level: "Avanzado",
    topic: "Entrada y salida",
    minutes: 50,
    concept:
      "FILE representa un flujo de la biblioteca estándar. Abrir, leer o escribir y cerrar son operaciones que pueden fallar. El programa debe comprobar sus resultados y cerrar los recursos que abrió.",
    why: "fopen con modo w+ crea o trunca un archivo de lectura y escritura. En Xcode, elige una ruta de práctica: ese modo reemplaza un archivo existente. rewind vuelve al comienzo antes de leer lo escrito. En la web se usa un sistema de archivos virtual efímero; no se accede a tus documentos.",
    trap: "feof no predice si una lectura va a funcionar. Primero intenta leer y comprueba el resultado. El archivo del navegador no persiste tras la ejecución. Este WASI requiere una ruta absoluta; el ejemplo selecciona una ruta distinta con #ifdef __wasi__ para mantener la ejecución nativa en el directorio de trabajo.",
    teacher:
      "Pregunta dónde queda el cursor después de escribir. Quita rewind y explica el resultado. Luego compara con un archivo nativo en Xcode.",
    challenge: "Escribe tres registros y recupéralos comprobando cada operación.",
    path: "lecciones/13-archivos.c",
    symbols: ["FILE *", "NULL", "&", "?:"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "Leido: 42\n",
      },
    ],
  },
  {
    id: "14-listas",
    title: "Una primera lista enlazada",
    level: "Avanzado",
    topic: "Estructuras de datos",
    minutes: 60,
    concept:
      "Una lista enlazada conecta nodos mediante punteros. Cada nodo conoce su dato y el siguiente; NULL señala el final. El recorrido depende de enlaces, no de índices contiguos.",
    why: "Esta primera lista usa dos nodos locales para separar la topología de la gestión de memoria. Una lista dinámica añade malloc/free, propiedad de nodos y tratamiento de fallos de reserva.",
    trap: "No liberes nodos locales con free ni conserves sus direcciones después de salir de su ámbito. Una lista con un ciclo no termina con un recorrido que solo busca NULL.",
    teacher:
      "Dibuja primero los enlaces y después el código. Compara acceso por índice en un arreglo con recorrido secuencial de una lista. Discute coste O(n).",
    challenge: "Agrega un tercer nodo y escribe una función que cuente los nodos sin modificar la lista.",
    path: "lecciones/14-listas.c",
    symbols: ["struct", "->", "NULL", "&"],
    tests: [
      {
        name: "Caso de referencia",
        input: "",
        output: "10\n20\n",
      },
    ],
  },
];
