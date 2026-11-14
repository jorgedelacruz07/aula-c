import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { lessons } from "../web/js/curriculum.js";
import { practices, practiceLabItem } from "../web/js/practices.js";
import { passes, symbols } from "../web/js/learning.js";

test("Each topic offers a progressive practice ladder with independent routes and drafts", () => {
  assert.equal(new Set(practices.map((p) => p.id)).size, practices.length);
  for (const lesson of lessons) {
    const group = practices.filter((p) => p.lessonId === lesson.id);
    assert.deepEqual(
      group.map((p) => p.difficulty),
      ["Inicio", "Aplicación", "Reto"],
      lesson.id,
    );
    for (const p of group) {
      const item = practiceLabItem(p);
      assert.equal(item.level, lesson.level);
      assert.equal(item.topic, lesson.topic);
      assert.notEqual(item.path, lesson.path);
      assert.equal(item.path, p.solutionPath);
      assert.equal(item.practiceMode, "solution");
      assert.equal(item.sourceC, undefined, "Default loading must fetch the complete reference file");
      const template = practiceLabItem(p, "template");
      assert.equal(template.path, `practicas/${p.id}.c`, "Existing template drafts keep their route");
      assert.equal(template.sourceC, p.sourceC);
      assert.notEqual(
        template.path,
        item.path,
        "An old unfinished draft must never replace the solved reference",
      );
      assert(p.statement && p.inputDescription && p.outputDescription && p.why && p.trap && p.teacher);
      assert(p.hints.length >= 2 && p.constraints.length >= 1);
      assert(p.sourceC.includes("TODO"));
      assert(!p.solutionC, "The reference solution remains in its canonical C file");
      for (const symbol of item.symbols) assert(symbols[symbol], `${p.id}: ${symbol}`);
      assert(p.tests.length >= (p.inputDescription.startsWith("Sin entrada") ? 1 : 3), p.id);
      assert(Buffer.byteLength(p.sourceC, "utf8") <= 65536, `${p.id}: starter exceeds the web code limit`);
      for (const fixture of p.tests) {
        assert(
          Buffer.byteLength(fixture.input, "utf8") <= 4096,
          `${p.id}/${fixture.name}: input exceeds the web runtime limit`,
        );
      }
    }
  }
  assert.throws(() => practiceLabItem({ lessonId: "missing" }), /asociada/);
  assert.throws(() => practiceLabItem(practices[0], "invalid"), /desconocido/);
});

test("Commented reference solutions compile cleanly and pass every case; starters compile but remain unfinished", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "aula-practices-"));
  let executed = 0;
  const compile = (source, binary, id) => {
    const result = spawnSync(
      "clang",
      ["-std=c17", "-Wall", "-Wextra", "-Werror", "-pedantic", source, "-o", binary],
      { encoding: "utf8", timeout: 15000 },
    );
    assert.equal(result.status, 0, `${id}: ${result.stderr || result.error}`);
  };
  const run = (binary, fixture) => {
    const result = spawnSync(binary, {
      input: fixture.input,
      cwd: temporary,
      encoding: "utf8",
      timeout: 3000,
    });
    assert(!result.error, result.error?.message);
    assert.equal(result.signal, null);
    return { phase: "ejecución", exitCode: result.status, stdout: result.stdout };
  };
  try {
    for (const p of practices) {
      const source = await readFile(p.solutionPath, "utf8");
      assert(source.includes("/*"), `${p.id}: teaching comments`);
      const binary = join(temporary, p.id);
      compile(p.solutionPath, binary, p.id);
      for (const fixture of p.tests) {
        const result = run(binary, fixture);
        assert(
          passes(result, fixture),
          `${p.id}/${fixture.name}: expected ${JSON.stringify(fixture)}, got ${JSON.stringify(result)}`,
        );
        executed++;
      }
      const starter = join(temporary, `${p.id}-starter.c`);
      const starterBinary = join(temporary, `${p.id}-starter`);
      await writeFile(starter, p.sourceC);
      compile(starter, starterBinary, `${p.id} starter`);
      assert(
        p.tests.some((fixture) => !passes(run(starterBinary, fixture), fixture)),
        `${p.id}: starter already solves every case`,
      );
    }
    assert(executed >= 140, "The practice ladder must exercise normal, boundary and error behavior");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
