// Publica la API privada de administración y la web estática de Aula C.
import { spawnSync } from "node:child_process";

const firebaseProject = "aula-c-jorge";
const apiProject = "aula-c-knowledge-jorge";
const apiRegion = "us-central1";
const apiService = "aula-c-docs-api";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: false, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result;
}

console.log("Publicando API de documentos en Cloud Run…");
run("node", ["scripts/deploy-api.mjs"]);

const endpoint = spawnSync(
  "gcloud",
  [
    "run",
    "services",
    "describe",
    apiService,
    `--project=${apiProject}`,
    `--region=${apiRegion}`,
    "--format=value(status.url)",
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], shell: false },
);
if (endpoint.error) throw endpoint.error;
if (endpoint.status !== 0 || !/^https:\/\//.test(endpoint.stdout.trim())) {
  throw new Error("No pude determinar la URL del API de Aula C en Cloud Run.");
}

const apiUrl = `${endpoint.stdout.trim()}/api`;
console.log(`Construyendo Aula C para ${apiUrl}…`);
run("npm", ["run", "build"], { env: { ...process.env, VITE_AULA_API_URL: apiUrl } });
console.log(`Publicando configuración de acceso y sitio en ${firebaseProject}…`);
run("firebase", ["deploy", "--only", "auth,hosting", "--project", firebaseProject]);
console.log(`Listo: https://${firebaseProject}.web.app`);
