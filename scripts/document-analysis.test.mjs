import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { generateDraft, safeDraft, createApiServer } from "../api/server.mjs";

function draft() {
  return {
    documentTitle: "Ciclos anidados",
    course: "Programación C",
    topicSummary: "Conteo de filas y columnas.",
    lessons: [
      {
        title: "Recorrer filas",
        level: "Básico",
        topic: "Ciclos",
        everyday: "Organizar asientos.",
        concept: "El ciclo interior recorre las columnas de cada fila.",
        why: "Cada fila reinicia el contador.",
        exampleC: '#include <stdio.h>\nint main(void) { /* Contar filas. */ puts("2"); return 0; }',
        symbols: [{ symbol: "while", explanation: "Repite mientras la condición sea verdadera." }],
        sourcePages: [1],
        sourceSections: [],
        teacherOpening: "Predice cuántas columnas se visitan.",
        teacherQuestions: ["¿Cuándo se reinicia el contador?"],
        commonErrors: ["No reiniciar el contador interior."],
        rubric: ["Justifica el reinicio."],
        blackboard: "fila → columnas → siguiente fila",
      },
    ],
    exercises: [
      {
        title: "Contar asientos",
        level: "Básico",
        everyday: "Preparar un aula.",
        statement: "Cuenta los asientos.",
        input: "Sin entrada.",
        output: "2",
        solutionC: '#include <stdio.h>\nint main(void) { puts("2"); return 0; }',
        tests: [{ name: "Dos asientos", input: "", expectedOutput: "2\n" }],
        sourcePages: [1],
      },
    ],
  };
}

function answer(value = draft(), finishReason = "STOP") {
  return new Response(
    JSON.stringify({ candidates: [{ finishReason, content: { parts: [{ text: JSON.stringify(value) }] } }] }),
    { status: 200 },
  );
}
const metadata = { contentType: "application/pdf", originalName: "guia.pdf" };
const pdf = Buffer.from("%PDF-test");

test("A truncated response is retried with a smaller schema and the complete original PDF", async () => {
  const requests = [];
  const result = await generateDraft(pdf, "test-key", metadata, {
    fetchImpl: async (_, options) => {
      requests.push(options);
      if (requests.length === 1) return answer(draft(), "MAX_TOKENS");
      const response = await answer().json();
      response.candidates[0].content.parts.unshift({ thought: true, text: "private reasoning" });
      return Response.json(response);
    },
  });
  assert.equal(requests.length, 2);
  assert.deepEqual(result, draft());
  const first = JSON.parse(requests[0].body),
    second = JSON.parse(requests[1].body);
  assert.equal(first.generationConfig.thinkingConfig.thinkingBudget, 1024);
  assert(first.generationConfig.maxOutputTokens > 12000);
  assert(
    second.generationConfig.responseSchema.properties.lessons.maxItems <
      first.generationConfig.responseSchema.properties.lessons.maxItems,
  );
  assert.equal(second.contents[0].parts[1].inlineData.data, pdf.toString("base64"));
  assert.equal(requests[0].signal, requests[1].signal);
});

test("Quota errors preserve their cause and never consume a second attempt", async () => {
  let calls = 0;
  await assert.rejects(
    generateDraft(pdf, "test-key", metadata, {
      fetchImpl: async () => {
        calls++;
        return Response.json({ error: { status: "RESOURCE_EXHAUSTED" } }, { status: 429 });
      },
    }),
    (error) => error.status === 429 && error.code === "gemini_free_quota",
  );
  assert.equal(calls, 1);
});

test("Missing teacher guidance triggers recovery before a generated lesson is saved", async () => {
  let calls = 0;
  const result = await generateDraft(pdf, "test-key", metadata, {
    fetchImpl: async (_, options) => {
      calls++;
      const config = JSON.parse(options.body).generationConfig;
      assert(config.responseSchema.properties.lessons.items.required.includes("teacherQuestions"));
      const value = draft();
      if (calls === 1) {
        delete value.lessons[0].teacherOpening;
        value.lessons[0].teacherQuestions = [];
      }
      return answer(value);
    },
  });
  assert.equal(calls, 2);
  assert(result.lessons[0].teacherQuestions.length > 0);
});

test("Repeated truncation is reported as incomplete output, not an invalid PDF", async () => {
  await assert.rejects(
    generateDraft(pdf, "test-key", metadata, { fetchImpl: async () => answer(draft(), "MAX_TOKENS") }),
    (error) =>
      error.status === 502 &&
      error.code === "gemini_response_incomplete" &&
      error.message.includes("guardado"),
  );
});

test("Malformed JSON and structurally invalid lessons are rejected after bounded recovery", async () => {
  let calls = 0;
  await assert.rejects(
    generateDraft(pdf, "test-key", metadata, {
      fetchImpl: async () => {
        calls++;
        if (calls === 1)
          return Response.json({
            candidates: [{ finishReason: "STOP", content: { parts: [{ text: '{"lessons":[' }] } }],
          });
        const value = draft();
        value.lessons[0].symbols = [null];
        return answer(value);
      },
    }),
    (error) => error.code === "invalid_ai_response",
  );
  assert.equal(calls, 2);
});

test("Timeouts and safety blocks are actionable and do not retry automatically", async () => {
  await assert.rejects(
    generateDraft(pdf, "test-key", metadata, {
      fetchImpl: async () => {
        throw new DOMException("timed out", "TimeoutError");
      },
    }),
    (error) => error.status === 504 && error.code === "gemini_timeout",
  );
  let calls = 0;
  await assert.rejects(
    generateDraft(pdf, "test-key", metadata, {
      fetchImpl: async () => {
        calls++;
        return answer(draft(), "SAFETY");
      },
    }),
    (error) => error.code === "gemini_content_blocked",
  );
  assert.equal(calls, 1);
});

test("Draft validation rejects invalid references and unusable exercise cases", () => {
  let value = draft();
  value.lessons[0].sourcePages = [0];
  assert.throws(
    () => safeDraft(value),
    (error) => error.code === "invalid_draft",
  );
  value = draft();
  value.exercises[0].tests = [];
  assert.throws(
    () => safeDraft(value),
    (error) => error.code === "invalid_draft",
  );
  value = draft();
  value.lessons[0].objectives = "wrong type";
  assert.throws(
    () => safeDraft(value),
    (error) => error.code === "invalid_draft",
  );
});

test("Text documents use UTF-8 content and reject corrupted encoding before an AI call", async () => {
  let input;
  await generateDraft(
    Buffer.from("Sección 1: ciclos"),
    "test-key",
    { contentType: "text/plain", originalName: "guia.txt" },
    {
      fetchImpl: async (_, options) => {
        input = JSON.parse(options.body);
        return answer();
      },
    },
  );
  assert(input.contents[0].parts[1].text.includes("Sección 1"));
  await assert.rejects(
    generateDraft(
      Buffer.from([0xff]),
      "test-key",
      { contentType: "text/plain" },
      {
        fetchImpl: async () => {
          assert.fail("must not call Gemini");
        },
      },
    ),
    (error) => error.code === "invalid_text_encoding",
  );
});

test("Failed analysis keeps the original and a retry saves only a private draft, clearing stale errors", async () => {
  const id = "e4f9c80f-4579-4ea5-807f-d885b6328554",
    prefix = "documents/" + id;
  const metaKey = prefix + "/metadata.json",
    sourceKey = prefix + "/source.pdf",
    draftKey = prefix + "/draft.json";
  const objects = new Map([
    [
      metaKey,
      Buffer.from(JSON.stringify({ id, status: "uploaded", sourceKey, contentType: "application/pdf" })),
    ],
    [sourceKey, pdf],
  ]);
  let fail = true;
  const bucket = {
    file: (key) => ({
      download: async () => [objects.get(key)],
      getMetadata: async () => [{ size: objects.get(key)?.length, contentType: "application/pdf" }],
      save: async (bytes) => objects.set(key, Buffer.from(bytes)),
    }),
    getFiles: async () => [[]],
  };
  const server = createApiServer({
    bucketName: "private-bucket",
    storage: { bucket: () => bucket },
    verifyToken: async () => ({ email: "jdelacruzp7@gmail.com" }),
    analyze: async () =>
      generateDraft(pdf, "test-key", metadata, {
        fetchImpl: async () => (fail ? Response.json({}, { status: 429 }) : answer()),
      }),
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    let response = await fetch(base + "/api/admin/documents/" + id + "/analyze", {
      method: "POST",
      headers: { Authorization: "Bearer test" },
    });
    assert.equal(response.status, 429);
    let stored = JSON.parse(objects.get(metaKey));
    assert.equal(stored.status, "quota");
    assert.equal(stored.errorCode, "gemini_free_quota");
    assert(stored.errorMessage);
    assert(!objects.has(draftKey));
    assert.deepEqual(objects.get(sourceKey), pdf);
    fail = false;
    response = await fetch(base + "/api/admin/documents/" + id + "/analyze", {
      method: "POST",
      headers: { Authorization: "Bearer test" },
    });
    assert.equal(response.status, 200);
    stored = JSON.parse(objects.get(metaKey));
    assert.equal(stored.status, "draft");
    assert.equal(stored.errorCode, undefined);
    assert.equal(stored.errorMessage, undefined);
    assert.deepEqual(JSON.parse(objects.get(draftKey)), draft());
    assert(![...objects.keys()].some((key) => key.startsWith("published/")));
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
