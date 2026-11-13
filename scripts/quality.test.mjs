import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { lessons } from "../web/js/curriculum.js";
import { exercises } from "../web/js/catalog.js";
import { symbols, normalizeOutput, passes } from "../web/js/learning.js";
import { readTar } from "../web/js/runner.js";

test("Output comparison preserves significant whitespace and requires execution and exit status", () => {
  const expected = { output: "x \n" };
  assert.equal(normalizeOutput("x\r\n"), "x\n");
  assert(passes({ phase: "ejecución", exitCode: 0, stdout: "x \r\n" }, expected));
  assert(!passes({ phase: "compilación", exitCode: 0, stdout: "x \n" }, expected));
  assert(!passes({ phase: "ejecución", exitCode: 1, stdout: "x \n" }, expected));
  assert(!passes({ phase: "ejecución", exitCode: 0, stdout: "x\n" }, expected));
});

test("Every lesson has source, explanatory symbols, teaching guidance and executable reference cases", async () => {
  assert.equal(new Set(lessons.map((item) => item.id)).size, lessons.length);
  assert.deepEqual([...new Set(lessons.map((item) => item.level))], ["Básico", "Intermedio", "Avanzado"]);
  for (const lesson of lessons) {
    assert(lesson.concept && lesson.why && lesson.trap && lesson.teacher && lesson.challenge);
    assert(lesson.tests.length > 0);
    for (const symbol of lesson.symbols) assert(symbols[symbol], `${lesson.id}: ${symbol}`);
    const source = await readFile(lesson.path, "utf8");
    assert(source.includes("/*"), `${lesson.id}: missing teaching comments`);
  }
});

test("Tar parser rejects traversal and truncated data", () => {
  const archive = new Uint8Array(1024);
  const encoder = new TextEncoder();
  archive.set(encoder.encode("../escape"), 0);
  assert.throws(() => readTar(archive), /Ruta inválida/);
  archive.fill(0);
  archive.set(encoder.encode("safe"), 0);
  archive.set(encoder.encode("00000100000"), 124);
  assert.throws(() => readTar(archive), /dañado/);
});

test("Lesson programs compile and reproduce all reference outputs with native clang", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "aula-c-"));
  try {
    for (const lesson of lessons) {
      const binary = join(temporary, lesson.id);
      const compile = spawnSync(
        "clang",
        ["-std=c17", "-Wall", "-Wextra", "-pedantic", lesson.path, "-lm", "-o", binary],
        { encoding: "utf8", timeout: 15000 },
      );
      assert.equal(compile.status, 0, `${lesson.id}: ${compile.stderr || compile.error}`);
      for (const fixture of lesson.tests) {
        const run = spawnSync(binary, {
          input: fixture.input,
          cwd: temporary,
          encoding: "utf8",
          timeout: 3000,
        });
        assert.equal(run.status, fixture.exitCode ?? 0, `${lesson.id}: ${run.stderr || run.error}`);
        assert.equal(normalizeOutput(run.stdout), normalizeOutput(fixture.output), lesson.id);
      }
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("All original stored C cases remain valid (including nested loops)", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "aula-original-"));
  try {
    const inputs = (await readdir("pruebas")).filter((name) => name.endsWith(".in"));
    let count = 0;
    for (const exercise of exercises) {
      const stem = exercise.path.split("/").pop().replace(".c", "");
      const fixtures = inputs.filter(
        (name) => name.startsWith(exercise.id + "_") || name.startsWith("anidados_" + stem),
      );
      if (!fixtures.length) continue;
      const binary = join(temporary, exercise.id);
      const compile = spawnSync("clang", ["-Wall", "-Wextra", exercise.path, "-lm", "-o", binary], {
        encoding: "utf8",
        timeout: 15000,
      });
      assert.equal(compile.status, 0, `${exercise.id}: ${compile.stderr || compile.error}`);
      for (const name of fixtures) {
        const input = await readFile("pruebas/" + name, "utf8");
        const expected = await readFile("pruebas/" + name.slice(0, -3) + ".out", "utf8");
        const run = spawnSync(binary, { input, cwd: temporary, encoding: "utf8", timeout: 3000 });
        assert.equal(run.status, 0, `${name}: ${run.stderr || run.error}`);
        assert.equal(normalizeOutput(run.stdout), normalizeOutput(expected), name);
        count++;
      }
    }
    assert.equal(count, inputs.length, "Every input fixture must map to a program");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
