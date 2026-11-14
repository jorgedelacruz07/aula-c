import { spawn, spawnSync } from "node:child_process";

const project = "aula-c-knowledge-jorge";
const region = "us-central1";
const repository = "aula-c-images";
const service = "aula-c-docs-api";
const bucket = "aula-c-knowledge-jorge-774195700936";
const runtimeAccount = `aula-c-docs-api@${project}.iam.gserviceaccount.com`;
const secretName = "aula-c-gemini-api-key";
const image = `${region}-docker.pkg.dev/${project}/${repository}/docs-api:${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: false, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} terminó con estado ${result.status ?? "desconocido"}.`);
  return result;
}

function ensureSecret() {
  const exists = spawnSync("gcloud", ["secrets", "describe", secretName, `--project=${project}`], {
    stdio: "ignore",
    shell: false,
  });
  if (exists.status !== 0) {
    run("gcloud", [
      "secrets",
      "create",
      secretName,
      `--project=${project}`,
      "--replication-policy=automatic",
      "--quiet",
    ]);
  }
  run("gcloud", [
    "secrets",
    "add-iam-policy-binding",
    secretName,
    `--project=${project}`,
    `--member=serviceAccount:${runtimeAccount}`,
    "--role=roles/secretmanager.secretAccessor",
    "--quiet",
  ]);
}

function ensureRepository() {
  const exists = spawnSync(
    "gcloud",
    ["artifacts", "repositories", "describe", repository, `--project=${project}`, `--location=${region}`],
    { stdio: "ignore", shell: false },
  );
  if (exists.status !== 0) {
    run("gcloud", [
      "artifacts",
      "repositories",
      "create",
      repository,
      "--repository-format=docker",
      `--project=${project}`,
      `--location=${region}`,
      "--description=Aula C API container images",
      "--quiet",
    ]);
  }
  run("gcloud", [
    "artifacts",
    "repositories",
    "set-cleanup-policies",
    repository,
    `--project=${project}`,
    `--location=${region}`,
    "--policy=scripts/artifact-cleanup.json",
    "--no-dry-run",
    "--quiet",
  ]);
}

async function syncSecret() {
  const source = spawn(
    "doppler",
    ["secrets", "get", "AULA_C_GEMINI_API_KEY", "--project=dev-tools", "--config=dev", "--plain"],
    { stdio: ["ignore", "pipe", "inherit"], shell: false },
  );
  const chunks = [];
  source.stdout.on("data", (chunk) => chunks.push(chunk));
  const sourceExit = await new Promise((resolve, reject) => {
    source.on("error", reject);
    source.on("exit", (code) => resolve(code));
  });
  if (sourceExit !== 0) throw new Error("No se pudo leer el secreto Gemini desde Doppler.");
  const value = Buffer.concat(chunks)
    .toString("utf8")
    .replace(/[\r\n]+$/, "");
  if (!/^AIzaSy[\w-]{25,}$/.test(value))
    throw new Error("El secreto Gemini en Doppler no tiene el formato esperado.");

  const destination = spawn(
    "gcloud",
    [
      "secrets",
      "versions",
      "add",
      secretName,
      `--project=${project}`,
      "--data-file=-",
      "--format=value(name)",
    ],
    { stdio: ["pipe", "pipe", "inherit"], shell: false },
  );
  let version = "";
  destination.stdout.on("data", (chunk) => (version += chunk.toString("utf8")));
  const destinationExit = await new Promise((resolve, reject) => {
    destination.on("error", reject);
    destination.on("exit", (code) => resolve(code));
    destination.stdin.end(value);
  });
  if (destinationExit !== 0) throw new Error("No se pudo sincronizar Gemini con Secret Manager.");
  console.log(`Secreto sincronizado: ${version.trim()}`);
}

if (
  !process.env.DOPPLER_TOKEN &&
  spawnSync("doppler", ["me", "--json"], { stdio: "ignore", shell: false }).status !== 0
) {
  throw new Error("Doppler no está disponible o no tiene sesión. Ejecuta doppler login.");
}

console.log("Publicando API de Aula C desde Docker local hacia Cloud Run…");
ensureRepository();
ensureSecret();
await syncSecret();
run("gcloud", ["auth", "configure-docker", `${region}-docker.pkg.dev`, "--quiet"]);
run("docker", [
  "buildx",
  "build",
  "--platform=linux/amd64",
  "--push",
  "--tag",
  image,
  "--file",
  "api/Dockerfile",
  ".",
]);

const deploy = spawnSync(
  "gcloud",
  [
    "run",
    "deploy",
    service,
    `--project=${project}`,
    `--region=${region}`,
    `--image=${image}`,
    `--service-account=${runtimeAccount}`,
    `--set-env-vars=NODE_ENV=production,GOOGLE_CLOUD_PROJECT=${project},AULA_C_AUTH_PROJECT=aula-c-jorge,GCS_BUCKET=${bucket},ALLOWED_ORIGINS=https://aula-c-jorge.web.app`,
    `--set-secrets=GEMINI_API_KEY=${secretName}:latest`,
    "--port=8080",
    "--cpu=1",
    "--memory=1Gi",
    "--concurrency=1",
    "--max=1",
    "--min=0",
    "--cpu-throttling",
    "--timeout=240s",
    "--allow-unauthenticated",
    "--quiet",
    "--format=value(status.url)",
  ],
  { encoding: "utf8", shell: false },
);
if (deploy.error) throw deploy.error;
if (deploy.status !== 0) {
  process.stderr.write(deploy.stderr || "");
  throw new Error(`Cloud Run terminó con estado ${deploy.status ?? "desconocido"}.`);
}
const apiUrl = deploy.stdout.trim();
if (!/^https:\/\//.test(apiUrl)) throw new Error("Cloud Run no devolvió una URL HTTPS válida.");
console.log(`API disponible: ${apiUrl}`);
console.log(`VITE_AULA_API_URL=${apiUrl}/api`);
