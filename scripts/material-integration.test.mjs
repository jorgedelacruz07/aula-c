import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { materialLabItem, fetchPublishedMaterials } from "../web/js/materials.js";

test("Document lessons keep their own symbol explanations and full teaching guidance in the lab", () => {
  const lesson = {
    title: "Entrada de temperatura",
    level: "Básico",
    topic: "Entrada y salida",
    concept: "Leer un real.",
    why: "La lectura escribe en la dirección de la variable.",
    everyday: "Medir temperatura.",
    symbols: [{ symbol: "%lf", explanation: "scanf espera un puntero a double." }],
    exampleC: "/* Leer una temperatura. */",
    teacherOpening: "Predice qué ocurre sin &.",
    teacherQuestions: ["¿Qué objeto cambia?"],
    commonErrors: ["Omitir &."],
    rubric: ["Justifica el tipo."],
    blackboard: "dato → dirección → objeto",
  };
  const result = materialLabItem({ id: "source-1" }, lesson, 0, "lesson");
  assert.equal(result.sourceC, lesson.exampleC);
  assert.equal(result.symbolExplanations["%lf"], lesson.symbols[0].explanation);
  assert.equal(result.teacher, lesson.teacherOpening);
  assert.deepEqual(result.teacherDetails, {
    questions: lesson.teacherQuestions,
    blindspots: lesson.commonErrors,
    rubric: lesson.rubric,
    blackboard: lesson.blackboard,
  });
  assert.equal(result.path, "material/source-1/lesson-0.c");
});

test("Document exercise cases preserve stdin, significant output whitespace and laboratory identity", () => {
  const item = {
    title: "Recibo",
    statement: "Calcula el total.",
    solutionC: "/* Solución */",
    input: "Dos precios",
    output: "Total",
    tests: [{ name: "Normal", input: "2 3\n", expectedOutput: "5 \n" }],
  };
  const a = materialLabItem({ id: "a" }, item, 0, "exercise"),
    b = materialLabItem({ id: "b" }, item, 0, "exercise");
  assert.notEqual(a.path, b.path);
  assert.equal(a.concept, item.statement);
  assert.equal(a.tests[0].input, "2 3\n");
  assert.equal(a.tests[0].output, "5 \n");
  assert.equal(a.sourceC, item.solutionC);
});

test("The hosted knowledge API is used instead of a relative Firebase Hosting path", async () => {
  const paths = [];
  const server = createServer((req, res) => {
    paths.push(req.url);
    if (req.url === "/api/public/materials") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ materials: [{ id: "approved" }] }));
    } else {
      res.writeHead(404);
      res.end("Hosting page not found");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = "http://127.0.0.1:" + server.address().port;
  try {
    assert.deepEqual(await fetchPublishedMaterials(origin + "/api/"), [{ id: "approved" }]);
    await assert.rejects(fetchPublishedMaterials(origin), /no disponible/);
    assert.deepEqual(paths, ["/api/public/materials", "/public/materials"]);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("An invalid knowledge response is not mistaken for an empty approved catalog", async () => {
  await assert.rejects(
    fetchPublishedMaterials("/api", async () => Response.json({ documents: [] })),
    /formato inválido/,
  );
});
