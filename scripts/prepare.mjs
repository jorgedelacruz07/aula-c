import { mkdir, readFile, writeFile, cp, readdir, rm } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { exercises } from "../web/js/catalog.js";
const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const manifest = JSON.parse(await readFile("scripts/toolchain.json", "utf8"));
await mkdir(".cache/toolchain", { recursive: true });
// This directory is exclusively generated; remove deleted/renamed source material too.
await rm("web/public", { recursive: true, force: true });
await mkdir("web/public/toolchain", { recursive: true });
for (const [name, sha256] of Object.entries(manifest.files)) {
  const cache = resolve(".cache/toolchain", name);
  let bytes;
  try {
    bytes = await readFile(cache);
  } catch {
    console.log(`Descargando compilador: ${name}`);
    const response = await fetch(`${manifest.origin}/${name}`, { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`Toolchain ${name}: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  if (createHash("sha256").update(bytes).digest("hex") !== sha256) {
    throw new Error(`Integridad incorrecta: ${name}. No se usará este compilador.`);
  }
  await writeFile(cache, bytes);
  await writeFile(
    resolve("web/public/toolchain", name === "clang-fs.tar.gz" ? "clang-fs.tar" : name),
    name.endsWith(".gz") ? gunzipSync(bytes) : bytes,
  );
}
for (const directory of ["ejercicios", "pruebas", "lecciones"]) {
  await cp(directory, `web/public/${directory}`, { recursive: true });
}
await cp("licenses", "web/public/licenses", { recursive: true });
const fixtures = await readdir("pruebas");
const allSources = await readdir("ejercicios", { recursive: true, withFileTypes: true });
const known = new Set(exercises.map((item) => item.path));
const added = allSources
  .filter((entry) => entry.isFile() && entry.name.endsWith(".c"))
  .map((entry) => {
    const path =
      "ejercicios/" +
      resolve(entry.parentPath, entry.name)
        .slice(resolve("ejercicios").length + 1)
        .split("\\")
        .join("/");
    const id = path.slice(0, -2).replaceAll("/", "-");
    return {
      id,
      path,
      title: entry.name.slice(0, -2).replaceAll("_", " "),
      stage: "Material propio",
      level: path.includes("/basico/") ? "Básico" : path.includes("/avanzado/") ? "Avanzado" : "Intermedio",
    };
  })
  .filter((item) => !known.has(item.path))
  .sort((a, b) => a.path.localeCompare(b.path));
const catalog = await Promise.all(
  [...exercises, ...added].map(async (item) => {
    const stem = item.path.split("/").pop().replace(".c", "");
    const names = fixtures.filter(
      (name) =>
        name.endsWith(".in") && (name.startsWith(`${item.id}_`) || name.startsWith(`anidados_${stem}`)),
    );
    const tests = await Promise.all(
      names.map(async (name) => ({
        name: name.slice(0, -3),
        input: await readFile(`pruebas/${name}`, "utf8"),
        output: await readFile(`pruebas/${name.slice(0, -3)}.out`, "utf8"),
      })),
    );
    return { ...item, tests, topic: item.stage === "Anidados" ? "Ciclos anidados" : "Algoritmos numéricos" };
  }),
);
await writeFile("web/public/catalog.json", JSON.stringify(catalog, null, 2) + "\n");
console.log(
  `Contenido listo: ${catalog.length} ejercicios, ${catalog.reduce((n, x) => n + x.tests.length, 0)} pruebas y compilador local.`,
);
