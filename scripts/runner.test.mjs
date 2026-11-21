import test from "node:test";
import assert from "node:assert/strict";
import { CRunner } from "../web/js/runner.js";

const BASE = "/toolchain/abc123def456";

function setup({ compileExit = 0, linkExit = 0, manifest = true } = {}) {
  const calls = [];
  const fetched = [];
  const fetchImpl = async (url) => {
    fetched.push(url);
    if (url === "/toolchain/manifest.json") {
      return manifest
        ? { ok: true, json: async () => ({ version: "abc123def456", basePath: BASE }) }
        : { ok: false, json: async () => ({}) };
    }
    if (url.endsWith("/clang-fs.tar")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(512) };
    throw new Error(`Unexpected fetch ${url}`);
  };
  const createHost = (binaryURL, context) => {
    const kind = binaryURL.endsWith("clang.wasm")
      ? "clang"
      : binaryURL.endsWith("wasm-ld.wasm")
        ? "wasm-ld"
        : "program";
    calls.push({ kind, binaryURL, stdin: null });
    return {
      stdinBuffer: new SharedArrayBuffer(4100),
      kill() {},
      async start() {
        if (kind === "clang") return { exitCode: compileExit, fs: {} };
        if (kind === "wasm-ld") {
          return {
            exitCode: linkExit,
            fs: { "/program.wasm": { mode: "binary", content: new Uint8Array([0, 97, 115, 109]) } },
          };
        }
        context.stdout("ok\n");
        return { exitCode: 0, fs: {} };
      },
    };
  };
  return { runner: new CRunner({ fetchImpl, createHost }), calls, fetched };
}

const count = (calls, kind) => calls.filter((call) => call.kind === kind).length;
const tests = Array.from({ length: 9 }, (_, i) => ({ name: `case ${i}`, input: `${i}\n`, output: "ok\n" }));

test("runner needs a cross-origin isolated browser", async () => {
  const previous = globalThis.crossOriginIsolated;
  globalThis.crossOriginIsolated = false;
  try {
    const { runner } = setup();
    await assert.rejects(() => runner.runTests("int main(){}", tests), /COOP\/COEP/);
  } finally {
    globalThis.crossOriginIsolated = previous;
  }
});

test("BEFORE (N independent run() calls): clang and wasm-ld execute once per test case", async () => {
  globalThis.crossOriginIsolated = true;
  const { runner, calls } = setup();
  for (const item of tests) await runner.run("int main(){return 0;}", item.input);
  assert.equal(count(calls, "clang"), 9);
  assert.equal(count(calls, "wasm-ld"), 9);
  assert.equal(count(calls, "program"), 9);
  console.log(
    `before: clang=${count(calls, "clang")} wasm-ld=${count(calls, "wasm-ld")} program=${count(calls, "program")}`,
  );
});

test("AFTER (runTests): C source is compiled and linked once and every case reuses the wasm", async () => {
  globalThis.crossOriginIsolated = true;
  const { runner, calls } = setup();
  const seen = [];
  const { compiled, results } = await runner.runTests("int main(){return 0;}", tests, {
    onCase: (testCase, result, index) => seen.push([testCase.name, result.stdout, index]),
  });
  assert.equal(compiled.ok, true);
  assert.equal(results.length, 9);
  assert.equal(count(calls, "clang"), 1);
  assert.equal(count(calls, "wasm-ld"), 1);
  assert.equal(count(calls, "program"), 9);
  assert.equal(new Set(calls.filter((c) => c.kind === "program").map((c) => c.binaryURL)).size, 1);
  assert.deepEqual(seen[8], ["case 8", "ok\n", 8]);
  assert.equal(runner.active, false);
  console.log(
    `after: clang=${count(calls, "clang")} wasm-ld=${count(calls, "wasm-ld")} program=${count(calls, "program")}`,
  );
});

test("toolchain assets load from the hashed base path and the manifest is fetched once", async () => {
  globalThis.crossOriginIsolated = true;
  const { runner, calls, fetched } = setup();
  await runner.runTests("int main(){}", tests.slice(0, 2));
  await runner.runTests("int main(){}", tests.slice(0, 2));
  assert.ok(calls.filter((c) => c.kind !== "program").every((c) => c.binaryURL.includes(`${BASE}/`)));
  assert.equal(fetched.filter((url) => url === "/toolchain/manifest.json").length, 1);
  assert.equal(fetched.filter((url) => url.endsWith("/clang-fs.tar")).length, 1);
});

test("a missing manifest falls back to the unversioned toolchain path", async () => {
  globalThis.crossOriginIsolated = true;
  const { runner, calls } = setup({ manifest: false });
  await runner.run("int main(){}", "");
  assert.ok(calls.find((c) => c.kind === "clang").binaryURL.includes("/toolchain/clang.wasm"));
});

test("a compile or link failure stops before any test case runs", async () => {
  globalThis.crossOriginIsolated = true;
  for (const options of [{ compileExit: 1 }, { linkExit: 1 }]) {
    const { runner, calls } = setup(options);
    const { compiled, results } = await runner.runTests("broken", tests);
    assert.equal(compiled.ok, false);
    assert.equal(results.length, 0);
    assert.equal(count(calls, "program"), 0);
    assert.equal(runner.active, false);
  }
});

test("oversized stdin is rejected before any compilation starts", async () => {
  globalThis.crossOriginIsolated = true;
  const { runner, calls } = setup();
  await assert.rejects(() => runner.runTests("int main(){}", [{ name: "big", input: "x".repeat(4097) }]));
  assert.equal(calls.length, 0);
});

test("cancelling aborts the remaining cases", async () => {
  globalThis.crossOriginIsolated = true;
  const { runner, calls } = setup();
  await assert.rejects(() =>
    runner.runTests("int main(){}", tests, { onCase: (_t, _r, index) => index === 1 && runner.cancel() }),
  );
  assert.equal(count(calls, "program"), 2);
  assert.equal(runner.active, false);
});
