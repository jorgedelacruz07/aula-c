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

// Each phase owns a worker, deadline and virtual filesystem. No native process or server execution.
export class CRunner {
  host = null;
  controller = null;
  baseFS = null;
  active = false;
  cancel() {
    this.controller?.abort(new Error("Ejecución detenida."));
    this.host?.kill();
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
    const host = new WASIWorkerHost(new URL(binaryURL, location.href).href, {
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
  async run(code, stdin = "", { standard = "c17", onStatus = () => {} } = {}) {
    if (this.active) throw new Error("Ya hay una ejecución activa.");
    if (!globalThis.crossOriginIsolated || typeof SharedArrayBuffer === "undefined") {
      throw new Error("El compilador necesita localhost o HTTPS y las cabeceras COOP/COEP. Usa npm run dev.");
    }
    if (new TextEncoder().encode(code).length > LIMIT || new TextEncoder().encode(stdin).length > 4096) {
      throw new Error("Límite: 64 KiB de código y 4096 bytes de entrada.");
    }
    if (!["c17", "c89"].includes(standard)) throw new Error("Estándar desconocido.");
    this.active = true;
    this.controller = new AbortController();
    const signal = this.controller.signal;
    const loadingDeadline = setTimeout(() => this.controller?.abort(), 60000);
    let url;
    try {
      if (!this.baseFS) {
        onStatus("Preparando las bibliotecas C…");
        const response = await fetch("/toolchain/clang-fs.tar", { signal });
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
        "/toolchain/clang.wasm",
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
      if (compiled.exitCode !== 0) return { ...compiled, phase: "compilación" };
      onStatus("Enlazando la biblioteca estándar…");
      const linked = await this.phase(
        "/toolchain/wasm-ld.wasm",
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
      if (linked.exitCode !== 0)
        return { ...linked, phase: "enlazado", stderr: compiled.stderr + linked.stderr };
      const file = linked.fs["/program.wasm"];
      if (!file || file.mode !== "binary") throw new Error("El enlazador no produjo un programa.");
      url = URL.createObjectURL(new Blob([file.content], { type: "application/wasm" }));
      onStatus("Ejecutando en un entorno aislado…");
      // Seed a root directory in the virtual drive so fopen can create files.
      const sandbox = {
        "/.aula": {
          path: "/.aula",
          mode: "string",
          content: "",
          timestamps: { access: now, modification: now, change: now },
        },
      };
      const execution = await this.phase(url, ["program"], sandbox, stdin, 3000, signal);
      return { ...execution, phase: "ejecución", stderr: compiled.stderr + linked.stderr + execution.stderr };
    } finally {
      clearTimeout(loadingDeadline);
      if (url) URL.revokeObjectURL(url);
      this.active = false;
      this.controller = null;
    }
  }
}
