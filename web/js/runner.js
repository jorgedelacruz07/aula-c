import { WASIWorkerHost } from "@runno/wasi";

const LIMIT = 65536;
export function readTar(bytes) {
  const files = {};
  const text = new TextDecoder();
  const field = (start, length) => text.decode(bytes.subarray(start, start + length)).split("\0")[0];
  for (let offset = 0; offset + 512 <= bytes.length;) {
    const name = field(offset, 100);
    if (!name) break;
    const prefix = field(offset + 345, 155);
    const path = "/" + (prefix ? `${prefix}/${name}` : name).replace(/^\.\//, "");
    const size = parseInt(field(offset + 124, 12).trim() || "0", 8);
    if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > bytes.length) {
      throw new Error("Archivo de bibliotecas dañado.");
    }
    if (path.split("/").includes("..")) throw new Error("Ruta inválida en las bibliotecas.");
    const type = field(offset + 156, 1);
    if (type === "0" || type === "") {
      const now = new Date();
      files[path] = {
        path,
        mode: "binary",
        content: bytes.slice(offset + 512, offset + 512 + size),
        timestamps: { access: now, modification: now, change: now },
      };
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}

function createSandboxFS() {
  const now = new Date();
  // Seed a root directory in the virtual drive so fopen can create files.
  return {
    "/.aula": {
      path: "/.aula",
      mode: "string",
      content: "",
      timestamps: { access: now, modification: now, change: now },
    },
  };
}

// Each phase owns a worker, deadline and virtual filesystem. No native process or server execution.
export class CRunner {
  host = null;
  controller = null;
  baseFS = null;
  toolchainBase = null;
  active = false;
  constructor({
    fetchImpl = (...args) => globalThis.fetch(...args),
    createHost = (binaryURL, context) => new WASIWorkerHost(new URL(binaryURL, location.href).href, context),
  } = {}) {
    this.fetchImpl = fetchImpl;
    this.createHost = createHost;
  }
  cancel() {
    this.controller?.abort(new Error("Ejecución detenida."));
    this.host?.kill();
  }
  async resolveToolchainBase(signal) {
    if (this.toolchainBase) return this.toolchainBase;
    try {
      const response = await this.fetchImpl("/toolchain/manifest.json", { signal });
      if (response.ok) {
        const manifest = await response.json();
        if (typeof manifest?.basePath === "string" && manifest.basePath.startsWith("/toolchain/")) {
          this.toolchainBase = manifest.basePath.replace(/\/$/, "");
          return this.toolchainBase;
        }
      }
    } catch (error) {
      if (signal?.aborted) throw error;
    }
    this.toolchainBase = "/toolchain";
    return this.toolchainBase;
  }
  async phase(binaryURL, args, fs, stdin, milliseconds, signal) {
    signal.throwIfAborted();
    let stdout = "",
      stderr = "",
      outputBytes = 0,
      exceeded = false;
    const append = (kind, chunk) => {
      outputBytes += new TextEncoder().encode(chunk).length;
      if (outputBytes > LIMIT) {
        exceeded = true;
        this.host?.kill();
        return;
      }
      if (kind === "out") stdout += chunk;
      else stderr += chunk;
    };
    const host = this.createHost(binaryURL, {
      args,
      fs,
      stdout: (chunk) => append("out", chunk),
      stderr: (chunk) => append("err", chunk),
    });
    this.host = host;
    const buffer = new DataView(host.stdinBuffer);
    const input = new TextEncoder().encode(stdin);
    new Uint8Array(host.stdinBuffer, 4).set(input);
    buffer.setInt32(0, input.length || -1);
    let timedOut = false;
    const stop = () => host.kill();
    const result = host.start();
    signal.addEventListener("abort", stop, { once: true });
    const deadline = setTimeout(() => {
      timedOut = true;
      host.kill();
    }, milliseconds);
    const eof = setInterval(() => {
      if (buffer.getInt32(0) === 0) {
        buffer.setInt32(0, -1);
        Atomics.notify(new Int32Array(host.stdinBuffer), 0);
      }
    }, 10);
    try {
      return { ...(await result), stdout, stderr };
    } catch (error) {
      if (signal.aborted) throw new Error("Ejecución detenida.");
      if (timedOut)
        throw new Error(`Tiempo agotado (${milliseconds / 1000} s). Revisa el progreso de tus ciclos.`);
      if (exceeded) throw new Error("Se detuvo el programa: salida mayor de 64 KiB.");
      throw new Error(error.message || "Error del entorno WebAssembly.");
    } finally {
      clearTimeout(deadline);
      clearInterval(eof);
      signal.removeEventListener("abort", stop);
      host.worker?.terminate();
      if (this.host === host) this.host = null;
    }
  }
  assertEnvironment() {
    if (!globalThis.crossOriginIsolated || typeof SharedArrayBuffer === "undefined") {
      throw new Error("El compilador necesita localhost o HTTPS y las cabeceras COOP/COEP. Usa npm run dev.");
    }
  }
  async compileInternal(code, { standard = "c17", onStatus = () => {} }, signal) {
    if (new TextEncoder().encode(code).length > LIMIT) {
      throw new Error("Límite: 64 KiB de código y 4096 bytes de entrada.");
    }
    if (!["c17", "c89"].includes(standard)) throw new Error("Estándar desconocido.");
    const loadingDeadline = setTimeout(() => this.controller?.abort(), 60000);
    try {
      const base = await this.resolveToolchainBase(signal);
      if (!this.baseFS) {
        onStatus("Preparando las bibliotecas C…");
        const response = await this.fetchImpl(`${base}/clang-fs.tar`, { signal });
        if (!response.ok)
          throw new Error("No se encuentran las bibliotecas. Ejecuta npm run prepare:content.");
        this.baseFS = readTar(new Uint8Array(await response.arrayBuffer()));
      }
      signal.throwIfAborted();
      clearTimeout(loadingDeadline);
      const now = new Date();
      const fs = {
        ...this.baseFS,
        "/program.c": {
          path: "/program.c",
          content: code,
          mode: "string",
          timestamps: { access: now, modification: now, change: now },
        },
      };
      onStatus("Compilando C → WebAssembly…");
      const compiled = await this.phase(
        `${base}/clang.wasm`,
        [
          "clang",
          "-cc1",
          "-triple",
          "wasm32-unknown-wasi",
          "-isysroot",
          "/sys",
          "-internal-isystem",
          "/sys/include",
          "-internal-isystem",
          "/sys/lib/clang/8.0.1/include",
          "-x",
          "c",
          `-std=${standard}`,
          "-Wall",
          "-Wextra",
          "-pedantic",
          "-ferror-limit",
          "5",
          "-O0",
          "-emit-obj",
          "-o",
          "/program.o",
          "/program.c",
        ],
        fs,
        "",
        20000,
        signal,
      );
      if (compiled.exitCode !== 0) return { ...compiled, phase: "compilación", ok: false };
      onStatus("Enlazando la biblioteca estándar…");
      const linked = await this.phase(
        `${base}/wasm-ld.wasm`,
        [
          "wasm-ld",
          "--no-threads",
          "-z",
          "stack-size=1048576",
          "-L/sys/lib/wasm32-wasi",
          "/sys/lib/wasm32-wasi/crt1.o",
          "/program.o",
          "-lc",
          "-lm",
          "-o",
          "/program.wasm",
        ],
        compiled.fs,
        "",
        20000,
        signal,
      );
      if (linked.exitCode !== 0) {
        return { ...linked, phase: "enlazado", stderr: compiled.stderr + linked.stderr, ok: false };
      }
      const file = linked.fs["/program.wasm"];
      if (!file || file.mode !== "binary") throw new Error("El enlazador no produjo un programa.");
      return {
        ok: true,
        phase: "enlazado",
        exitCode: 0,
        stdout: "",
        stderr: compiled.stderr + linked.stderr,
        wasmBytes: file.content,
      };
    } finally {
      clearTimeout(loadingDeadline);
    }
  }
  async executeUrlInternal(binaryURL, stdin, { onStatus = () => {}, compilerStderr = "" }, signal) {
    if (new TextEncoder().encode(stdin).length > 4096) {
      throw new Error("Límite: 64 KiB de código y 4096 bytes de entrada.");
    }
    onStatus("Ejecutando en un entorno aislado…");
    const execution = await this.phase(binaryURL, ["program"], createSandboxFS(), stdin, 3000, signal);
    return {
      ...execution,
      phase: "ejecución",
      stderr: compilerStderr + execution.stderr,
    };
  }
  async run(code, stdin = "", { standard = "c17", onStatus = () => {} } = {}) {
    if (this.active) throw new Error("Ya hay una ejecución activa.");
    this.assertEnvironment();
    if (new TextEncoder().encode(stdin).length > 4096) {
      throw new Error("Límite: 64 KiB de código y 4096 bytes de entrada.");
    }
    this.active = true;
    this.controller = new AbortController();
    const signal = this.controller.signal;
    let url;
    try {
      const compiled = await this.compileInternal(code, { standard, onStatus }, signal);
      if (!compiled.ok) return compiled;
      url = URL.createObjectURL(new Blob([compiled.wasmBytes], { type: "application/wasm" }));
      return await this.executeUrlInternal(url, stdin, { onStatus, compilerStderr: compiled.stderr }, signal);
    } finally {
      if (url) URL.revokeObjectURL(url);
      this.active = false;
      this.controller = null;
    }
  }
  /** Compile and link once, then reuse the produced WebAssembly module across every test fixture. */
  async runTests(code, tests, { standard = "c17", onStatus = () => {}, onCase = () => {} } = {}) {
    if (this.active) throw new Error("Ya hay una ejecución activa.");
    this.assertEnvironment();
    for (const test of tests) {
      if (new TextEncoder().encode(test.input || "").length > 4096) {
        throw new Error("Límite: 64 KiB de código y 4096 bytes de entrada.");
      }
    }
    this.active = true;
    this.controller = new AbortController();
    const signal = this.controller.signal;
    let url;
    try {
      const compiled = await this.compileInternal(code, { standard, onStatus }, signal);
      if (!compiled.ok) return { compiled, results: [] };
      url = URL.createObjectURL(new Blob([compiled.wasmBytes], { type: "application/wasm" }));
      const results = [];
      for (const [index, test] of tests.entries()) {
        onStatus(`Ejecutando caso ${index + 1} de ${tests.length}…`);
        const result = await this.executeUrlInternal(
          url,
          test.input || "",
          { onStatus: () => {}, compilerStderr: compiled.stderr },
          signal,
        );
        signal.throwIfAborted();
        results.push(result);
        onCase(test, result, index);
      }
      return { compiled, results };
    } finally {
      if (url) URL.revokeObjectURL(url);
      this.active = false;
      this.controller = null;
    }
  }
}
