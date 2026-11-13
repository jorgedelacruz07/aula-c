// Publica Aula C en Firebase Hosting: `npm run deploy`.
// Destino por defecto: el proyecto exclusivo `aula-c-jorge` (sin facturación).
// `FIREBASE_PROJECT=<id> npm run deploy` permite otro proyecto existente.
// Solo Hosting estático: no crea proyectos, no activa facturación ni cómputo.
import { spawnSync } from "node:child_process";

const DEFAULT_PROJECT = "aula-c-jorge";
const project = process.env.FIREBASE_PROJECT || DEFAULT_PROJECT;

if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(project)) {
  console.error(`ID de proyecto Firebase no válido: "${project}". Consulta docs/ARQUITECTURA.md.`);
  process.exit(1);
}

console.log(`Publicando Aula C en Firebase Hosting (${project})…`);

for (const [command, args] of [
  ["npm", ["run", "build"]],
  ["firebase", ["deploy", "--only", "hosting", "--project", project]],
]) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Listo: https://${project}.web.app`);
