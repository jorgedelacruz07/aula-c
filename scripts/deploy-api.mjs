// Publishes the Aula C docs API to Cloud Run with the canonical safety set:
// clean tree, immutable @sha256 digest, --no-traffic candidate + health probe before promotion,
// zero-cost flags (min 0, bounded max, CPU throttling) and Artifact Registry cleanup in dry-run unless asked.
// Mirrors meta-repo tools/deploy/deploy-engine.mjs (branch office/platform-deploy); do not import across repos.
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const config = {
  project: "aula-c-knowledge-jorge",
  region: "us-central1",
  repository: "aula-c-images",
  service: "aula-c-docs-api",
  bucket: "aula-c-knowledge-jorge-774195700936",
  authProject: "aula-c-jorge",
  allowedOrigins: "https://aula-c-jorge.web.app",
  secretName: "aula-c-gemini-api-key",
  healthPath: "/api/health",
  maxInstances: 1,
};
config.runtimeAccount = `aula-c-docs-api@${config.project}.iam.gserviceaccount.com`;
config.image = `${config.region}-docker.pkg.dev/${config.project}/${config.repository}/docs-api`;

const SHA256_RE = /^sha256:[a-f0-9]{64}$/;
const FLAGS = new Set(["--sync-secret", "--apply-ar-policy"]);

export function parseFlags(argv) {
  const unknown = argv.filter((arg) => !FLAGS.has(arg));
  if (unknown.length) throw new Error(`Flags no reconocidos: ${unknown.join(", ")}.`);
  return { syncSecret: argv.includes("--sync-secret"), applyArPolicy: argv.includes("--apply-ar-policy") };
}

export function assertCleanTree(exec) {
  const status = exec("git", ["status", "--porcelain"]);
  if (status.status !== 0) throw new Error("No se pudo leer el estado de git.");
  if (status.stdout.trim()) {
    throw new Error(
      "Árbol de trabajo sucio: haz commit o stash antes de desplegar (no se crean tags -dirty).",
    );
  }
  const head = exec("git", ["rev-parse", "HEAD"]);
  const sha = head.stdout.trim();
  if (head.status !== 0 || !/^[a-f0-9]{40}$/.test(sha)) throw new Error("No se pudo resolver HEAD.");
  return { sha, tag: sha.slice(0, 12) };
}

export function buildDeployArgs({ imageRef, commitSha, hasPreviousRevision }) {
  if (!/@sha256:[a-f0-9]{64}$/.test(imageRef || "")) {
    throw new Error(`Se rechaza el despliegue sin digest inmutable @sha256: ${String(imageRef)}`);
  }
  const args = [
    "run",
    "deploy",
    config.service,
    `--project=${config.project}`,
    `--region=${config.region}`,
    `--image=${imageRef}`,
    `--service-account=${config.runtimeAccount}`,
    `--set-env-vars=NODE_ENV=production,GOOGLE_CLOUD_PROJECT=${config.project},AULA_C_AUTH_PROJECT=${config.authProject},GCS_BUCKET=${config.bucket},ALLOWED_ORIGINS=${config.allowedOrigins},COMMIT_SHA=${commitSha}`,
    `--set-secrets=GEMINI_API_KEY=${config.secretName}:latest`,
    "--platform=managed",
    "--port=8080",
    "--cpu=1",
    "--memory=1Gi",
    "--concurrency=1",
    `--max-instances=${config.maxInstances}`,
    "--min-instances=0",
    "--cpu-throttling",
    "--no-cpu-boost",
    "--timeout=240s",
    "--allow-unauthenticated",
    "--tag=candidate",
    "--quiet",
  ];
  // The first deploy of a service has no previous revision, so --no-traffic would be rejected.
  if (hasPreviousRevision) args.push("--no-traffic");
  return args;
}

export function buildCleanupPolicyArgs({ apply }) {
  return [
    "artifacts",
    "repositories",
    "set-cleanup-policies",
    config.repository,
    `--project=${config.project}`,
    `--location=${config.region}`,
    "--policy=scripts/artifact-cleanup.json",
    apply ? "--no-dry-run" : "--dry-run",
    "--quiet",
  ];
}

export function checkZeroCostInvariants(service) {
  const annotations = service?.spec?.template?.metadata?.annotations || {};
  const minScale = annotations["autoscaling.knative.dev/minScale"];
  if (minScale && minScale !== "0") throw new Error(`Invariante de coste cero violado: minScale=${minScale}`);
  if (annotations["run.googleapis.com/cpu-throttling"] !== "true") {
    throw new Error("Invariante de coste cero violado: cpu-throttling no está activo.");
  }
  const maxScale = Number(annotations["autoscaling.knative.dev/maxScale"]);
  if (!Number.isFinite(maxScale) || maxScale < 1 || maxScale > config.maxInstances) {
    throw new Error(
      `Invariante de coste cero violado: maxScale=${annotations["autoscaling.knative.dev/maxScale"]}`,
    );
  }
}

function defaultExec(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", shell: false, ...options });
  if (result.error) throw result.error;
  return { status: result.status ?? 1, stdout: result.stdout || "", stderr: result.stderr || "" };
}

function must(exec, command, args, message, options) {
  const result = exec(command, args, options);
  if (result.status !== 0) throw new Error(`${message}${result.stderr ? `: ${result.stderr.trim()}` : ""}`);
  return result;
}

const serviceArgs = (...head) => [
  "run",
  "services",
  ...head,
  config.service,
  `--project=${config.project}`,
  `--region=${config.region}`,
];

function describeService(exec) {
  const result = must(
    exec,
    "gcloud",
    [...serviceArgs("describe"), "--platform=managed", "--format=json"],
    "No se pudo describir el servicio Cloud Run",
  );
  return JSON.parse(result.stdout);
}

function syncSecret() {
  const read = spawnSync(
    "doppler",
    ["secrets", "get", "AULA_C_GEMINI_API_KEY", "--project=dev-tools", "--config=dev", "--plain"],
    { encoding: "utf8", shell: false, stdio: ["ignore", "pipe", "inherit"] },
  );
  if (read.status !== 0) throw new Error("No se pudo leer el secreto Gemini desde Doppler.");
  const value = read.stdout.replace(/[\r\n]+$/, "");
  if (!/^AIzaSy[\w-]{25,}$/.test(value)) {
    throw new Error("El secreto Gemini en Doppler no tiene el formato esperado.");
  }
  const add = spawnSync(
    "gcloud",
    [
      "secrets",
      "versions",
      "add",
      config.secretName,
      `--project=${config.project}`,
      "--data-file=-",
      "--format=value(name)",
    ],
    { encoding: "utf8", shell: false, input: value, stdio: ["pipe", "pipe", "inherit"] },
  );
  if (add.status !== 0) throw new Error("No se pudo sincronizar Gemini con Secret Manager.");
  console.log(`Secreto sincronizado: ${add.stdout.trim()}`);
}

export async function deployApi({
  exec = defaultExec,
  fetchImpl = globalThis.fetch,
  flags = {},
  log = console.log,
} = {}) {
  const { sha, tag } = assertCleanTree(exec);
  if (flags.syncSecret) syncSecret();
  log(
    `Limpieza de Artifact Registry: ${flags.applyArPolicy ? "APLICA la política" : "dry-run (usa --apply-ar-policy para aplicarla)"}.`,
  );
  const policy = exec("gcloud", buildCleanupPolicyArgs({ apply: Boolean(flags.applyArPolicy) }));
  if (policy.status !== 0)
    log(`Aviso: no se pudo evaluar la política de limpieza (${policy.stderr.trim()}).`);

  must(
    exec,
    "gcloud",
    ["auth", "configure-docker", `${config.region}-docker.pkg.dev`, "--quiet"],
    "docker auth falló",
  );
  must(
    exec,
    "docker",
    [
      "buildx",
      "build",
      "--platform=linux/amd64",
      "--provenance=false",
      "--push",
      "--tag",
      `${config.image}:${tag}`,
      "--file",
      "api/Dockerfile",
      ".",
    ],
    "docker buildx falló",
    { stdio: "inherit" },
  );
  const digest = must(
    exec,
    "gcloud",
    [
      "artifacts",
      "docker",
      "images",
      "describe",
      `${config.image}:${tag}`,
      `--project=${config.project}`,
      "--format=value(image_summary.digest)",
    ],
    "No se pudo resolver el digest",
  ).stdout.trim();
  if (!SHA256_RE.test(digest)) throw new Error(`Digest inválido para ${config.image}:${tag}`);
  const imageRef = `${config.image}@${digest}`;

  const hasPreviousRevision =
    exec("gcloud", [...serviceArgs("describe"), "--format=value(metadata.name)"]).status === 0;
  must(
    exec,
    "gcloud",
    buildDeployArgs({ imageRef, commitSha: sha, hasPreviousRevision }),
    "Cloud Run rechazó el candidato",
  );
  const deployed = describeService(exec);
  const candidateRevision = deployed?.status?.latestCreatedRevisionName;
  const candidateUrl = (deployed?.status?.traffic || []).find((item) => item.tag === "candidate")?.url;
  if (!candidateRevision || !/^https:\/\//.test(candidateUrl || "")) {
    throw new Error("Falta la revisión o URL candidata; no se mueve el tráfico.");
  }

  const probe = await fetchImpl(`${candidateUrl}${config.healthPath}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (probe.status !== 200) {
    throw new Error(
      `El candidato ${candidateRevision} falló el health (${probe.status}); el tráfico sigue en la revisión anterior.`,
    );
  }
  must(
    exec,
    "gcloud",
    [
      ...serviceArgs("update-traffic"),
      "--platform=managed",
      `--to-revisions=${candidateRevision}=100`,
      "--quiet",
    ],
    "No se pudo promover el candidato",
  );
  const live = describeService(exec);
  checkZeroCostInvariants(live);
  const url = live?.status?.url;
  if (!/^https:\/\//.test(url || "")) throw new Error("Cloud Run no devolvió una URL HTTPS válida.");
  log(`Desplegado ${config.service} @ ${imageRef} (${candidateRevision}, commit ${sha})`);
  log(`API disponible: ${url}`);
  log(`VITE_AULA_API_URL=${url}/api`);
  return { imageRef, revision: candidateRevision, url };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flags = parseFlags(process.argv.slice(2));
  if (flags.syncSecret && !process.env.DOPPLER_TOKEN) {
    const me = spawnSync("doppler", ["me", "--json"], { stdio: "ignore", shell: false });
    if (me.status !== 0)
      throw new Error("Doppler no está disponible o no tiene sesión. Ejecuta doppler login.");
  }
  console.log("Publicando API de Aula C desde Docker local hacia Cloud Run…");
  await deployApi({ flags });
}
