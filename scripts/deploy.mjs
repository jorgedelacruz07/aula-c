// Publica la API privada de administración y la web estática de Aula C.
import { spawnSync } from "node:child_process";

const firebaseProject = "aula-c-jorge";
const apiProject = "aula-c-knowledge-jorge";
const apiRegion = "us-central1";
const apiService = "aula-c-docs-api";
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--api-only")) {
  throw new Error("Opción no válida. Usa npm run deploy o npm run deploy -- --api-only.");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: false, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result;
}

console.log("Publicando API de documentos en Cloud Run…");
run("node", ["scripts/deploy-api.mjs"]);
if (args.includes("--api-only")) {
  console.log("API de Aula C publicada.");
  process.exit(0);
}

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

const token = spawnSync("gcloud", ["auth", "print-access-token"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
  shell: false,
});
if (token.status === 0 && token.stdout.trim()) {
  run("curl", [
    "-fsS",
    "-X",
    "PATCH",
    "-H",
    `Authorization: Bearer ${token.stdout.trim()}`,
    "-H",
    `x-goog-user-project: ${firebaseProject}`,
    "-H",
    "Content-Type: application/json",
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${firebaseProject}/config?updateMask=authorizedDomains`,
    "-d",
    JSON.stringify({
      authorizedDomains: [
        "localhost",
        "127.0.0.1",
        `${firebaseProject}.firebaseapp.com`,
        `${firebaseProject}.web.app`,
      ],
    }),
    "-o",
    "/dev/null",
  ]);
}
console.log(`Listo: https://${firebaseProject}.web.app`);
