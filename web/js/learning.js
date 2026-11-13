export const symbols = {
  "#include":
    "Directiva del preprocesador: incorpora declaraciones de una cabecera antes de compilar. <stdio.h> usa la búsqueda de cabeceras del entorno.",
  "()": "En una declaración delimitan los parámetros; en una expresión de llamada delimitan los argumentos. También agrupan expresiones y cambian su precedencia.",
  "{}": "Delimitan un bloque y el ámbito de sus variables locales. En un inicializador, agrupan los valores iniciales de arreglos o estructuras.",
  ";": "Termina una declaración o una instrucción de expresión. Un ; solo es una instrucción vacía: cuidado después de if, while o for.",
  '""': "Delimitan una cadena literal. C añade un carácter nulo al final. Las comillas simples, como en 'A', expresan una constante de carácter.",
  "\\n":
    "Secuencia de escape para un salto de línea. Son dos símbolos en el archivo fuente que representan un carácter en la cadena.",
  "=": "Asignación: convierte y almacena el valor de la derecha en el objeto modificable de la izquierda. Para comparar igualdad se usa ==.",
  "/": "División: con dos operandos enteros el cociente se trunca hacia cero. Un operando de tipo double cambia la operación a división de punto flotante.",
  "%": "Residuo de división entera: a == (a / b) * b + a % b, si el cociente es representable. El divisor no puede ser cero.",
  "%d": "Conversión de formato para int: printf recibe un valor; scanf recibe un int * para escribir el resultado. No es el operador residuo en este contexto.",
  "%.2f":
    "Formato de printf: presenta un double con dos cifras decimales. No cambia el valor almacenado. Para leer un double con scanf se usa %lf.",
  "(tipo)":
    "Conversión explícita de tipo (cast). En (double)a / b se convierte a antes de la división. Convertir el resultado después de una división entera no recupera decimales.",
  "&": "Operador unario de dirección: &x obtiene un puntero al objeto x. Entre dos enteros, & es AND bit a bit; && es AND lógico.",
  "!=": "Compara desigualdad y produce int 0 o 1. scanf(...) != 1 detecta que no se consiguió la conversión esperada.",
  "||": "OR lógico con cortocircuito: si la izquierda es verdadera, no evalúa la derecha. Así se puede evitar usar un dato cuando su lectura falló.",
  "&&": "AND lógico con cortocircuito: la derecha se evalúa solo si la izquierda es verdadera. Ejemplo: p != NULL && *p > 0.",
  "==": "Compara igualdad y produce int 0 o 1. No almacena datos. Para comprobar tres valores escribe a == b && b == c.",
  "if / else":
    "Selección de una rama según una expresión escalar: 0 es falso; cualquier valor distinto de 0 es verdadero. Las llaves hacen explícito el cuerpo.",
  while:
    "Repite el cuerpo mientras la condición sea verdadera. Puede ejecutarse cero veces. Diseña una actualización que acerque la condición a falso.",
  "++": "Incrementa en uno un objeto modificable. i++ produce el valor anterior y ++i el nuevo; evita modificaciones múltiples de una variable en una misma expresión.",
  "+=": "Asignación compuesta: suma y guarda, evaluando el objeto izquierdo una sola vez. suma += i acumula sobre una variable previamente inicializada.",
  "<=": "Menor o igual, incluye el extremo superior. Para índices de un arreglo normalmente se usa i < longitud, porque longitud ya está fuera de rango.",
  "<": "Comparación estricta. En i < longitud excluye el índice longitud. En #include <stdio.h> los signos delimitan el nombre de una cabecera: es otro contexto.",
  prototipo:
    "Declaración de función que especifica retorno y tipos de parámetros. Permite comprobar las llamadas antes de su definición.",
  return:
    "Termina la función actual y, si corresponde, devuelve un valor. En main el valor expresa el estado de terminación del programa.",
  "*": "En int *p declara un puntero; como operador unario, *p accede al objeto apuntado; entre dos operandos, a * b multiplica. El contexto decide el significado.",
  "(*p)++":
    "Los paréntesis hacen que ++ incremente el objeto apuntado. Sin ellos, *p++ se interpreta como *(p++), avanzando el puntero.",
  NULL: "Macro que representa una constante de puntero nulo. Indica ausencia de objeto válido; no se puede desreferenciar. No equivale al carácter \\0 de una cadena.",
  "[]": "En una declaración indican un arreglo; en una expresión, a[i] accede al elemento i, equivalente a *(a + i). Los índices válidos deben controlarse.",
  sizeof:
    "Obtiene un tamaño en bytes como size_t. sizeof *p se basa en el tipo apuntado y, salvo tipos de longitud variable, no evalúa *p.",
  for: "Reúne inicio, condición y actualización de un ciclo. Es parte del lenguaje C; las restricciones académicas deben comprobarse contra el material de cada curso.",
  "\\0":
    "Carácter de valor cero que termina una cadena C. Un arreglo de char necesita espacio para los caracteres y este terminador.",
  "%s": "Conversión para cadenas. printf lee hasta el terminador nulo. En scanf hay que limitar el ancho para evitar sobrescribir el búfer.",
  "-": "Entre operandos resta; como operador unario cambia el signo. En recursión, n - 1 puede expresar un problema menor, con un caso base alcanzable.",
  struct:
    "Define un tipo que agrupa miembros. Puede haber relleno de alineación. Los objetos de ese tipo pueden ser locales, estáticos o reservados dinámicamente.",
  ".": "Selecciona un miembro de una estructura o unión: alumno.nota. El operando izquierdo es el objeto, no un puntero.",
  "->": "Selecciona un miembro mediante un puntero válido a estructura: p->nota equivale a (*p).nota.",
  const:
    "Califica un tipo: impide modificar un objeto mediante ese acceso. const struct Alumno *p no permite cambiar los campos a través de p.",
  "FILE *":
    "Puntero a un flujo de la biblioteca stdio. Debe obtenerse de una operación válida, comprobarse y cerrarse cuando corresponda.",
  "?:": "Operador condicional: condicion ? valor_si_verdadero : valor_si_falso. Solo se evalúa una de las dos ramas.",
};
export function normalizeOutput(value) {
  return value.replaceAll("\r\n", "\n");
}
export function passes(result, test) {
  return (
    result.phase === "ejecución" &&
    result.exitCode === (test.exitCode ?? 0) &&
    normalizeOutput(result.stdout) === normalizeOutput(test.output)
  );
}
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
