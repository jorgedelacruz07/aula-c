// Convert reviewed document resources into the same laboratory contract as built-in lessons.
export function materialLabItem(material, item, index, type) {
  const isLesson = type === "lesson";
  const title = item.title || (isLesson ? "Lección" : "Ejercicio");
  const explanations = isLesson
    ? Object.fromEntries((item.symbols || []).map((entry) => [entry.symbol, entry.explanation]))
    : {};
  return {
    id: `material-${material.id}-${type}-${index}`,
    path: `material/${material.id}/${type}-${index}.c`,
    title,
    level: item.level || "Intermedio",
    topic: item.topic || (isLesson ? "Material docente" : "Práctica guiada"),
    minutes: item.minutes || 20,
    everyday: item.everyday || "Problema basado en material docente revisado.",
    concept: isLesson ? item.concept : item.statement,
    why: isLesson
      ? item.why
      : `Entrada: ${item.input || "por definir"}. Salida: ${item.output || "por definir"}. ${item.constraints?.join(" ") || ""}`,
    symbols: isLesson ? Object.keys(explanations) : ["#include", "()", "{}", ";"],
    symbolExplanations: explanations,
    trap: item.commonErrors?.join(" ") || item.hints?.join(" "),
    challenge:
      (item.teacherQuestions || []).join(" ") || "Explica qué decisión tomaste y qué caso límite probarías.",
    teacher: item.teacherOpening,
    teacherDetails: isLesson
      ? {
          questions: item.teacherQuestions || [],
          blindspots: item.commonErrors || [],
          rubric: item.rubric || [],
          blackboard: item.blackboard || "",
        }
      : undefined,
    sourceC: isLesson ? item.exampleC : item.solutionC,
    tests: (item.tests || []).map((test, testIndex) => ({
      name: test.name || `Caso ${testIndex + 1}`,
      input: test.input || "",
      output: test.expectedOutput || test.output || "",
    })),
    stage: "Material docente",
  };
}

export async function fetchPublishedMaterials(apiBase, fetchImpl = fetch) {
  const response = await fetchImpl(apiBase.replace(/\/$/, "") + "/public/materials");
  if (!response.ok) throw new Error("Material docente temporalmente no disponible.");
  const payload = await response.json();
  if (!Array.isArray(payload?.materials)) throw new Error("El catálogo docente tiene un formato inválido.");
  return payload.materials;
}
