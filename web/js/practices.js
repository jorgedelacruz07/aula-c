import { lessons } from "./curriculum.js";
import topic01 from "./practice-content/01-hola.js";
import topic02 from "./practice-content/02-tipos.js";
import topic03 from "./practice-content/03-entrada.js";
import topic04 from "./practice-content/04-decisiones.js";
import topic05 from "./practice-content/05-ciclos.js";
import topic06 from "./practice-content/06-funciones.js";
import topic07 from "./practice-content/07-punteros.js";
import topic08 from "./practice-content/08-arreglos.js";
import topic09 from "./practice-content/09-cadenas.js";
import topic10 from "./practice-content/10-recursion.js";
import topic11 from "./practice-content/11-memoria.js";
import topic12 from "./practice-content/12-estructuras.js";
import topic13 from "./practice-content/13-archivos.js";
import topic14 from "./practice-content/14-listas.js";

export const practices = [
  ...topic01,
  ...topic02,
  ...topic03,
  ...topic04,
  ...topic05,
  ...topic06,
  ...topic07,
  ...topic08,
  ...topic09,
  ...topic10,
  ...topic11,
  ...topic12,
  ...topic13,
  ...topic14,
];

const extraSymbols = {
  "01": ["%s"],
  "04": ["%"],
  "05": ["for", "++", "+="],
  "06": ["for", "while", "%", "<="],
  "07": ["&", "*", "%d"],
  "08": ["[]", "for", "while", "<", "+="],
  "09": ["\\0", "[]", "for", "const"],
  10: ["%", "/", "-", "return", "const"],
  11: ["sizeof", "NULL", "[]", "for"],
  12: ["[]", "for", "."],
  13: ["[]", "for", "while", "FILE *", "NULL"],
  14: ["->", "struct", "NULL", "sizeof", "const"],
};

/** Open the solved reference by default; keep optional starter drafts on their original route. */
export function practiceLabItem(practice, mode = "solution") {
  if (!["solution", "template"].includes(mode)) throw new Error("Modo de práctica desconocido.");
  const parent = lessons.find((lesson) => lesson.id === practice.lessonId);
  if (!parent) throw new Error("Práctica sin lección asociada.");
  return {
    ...parent,
    ...practice,
    path: mode === "solution" ? practice.solutionPath : `practicas/${practice.id}.c`,
    sourceC: mode === "template" ? practice.sourceC : undefined,
    practiceMode: mode,
    stage: "Práctica",
    everyday: practice.statement,
    symbols: [...new Set([...parent.symbols, ...(extraSymbols[parent.id.slice(0, 2)] || [])])],
  };
}
