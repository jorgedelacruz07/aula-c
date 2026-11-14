import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const prepared = spawnSync("npm", ["run", "prepare:content"], { stdio: "inherit", shell: false });
if (prepared.error) throw prepared.error;
if (prepared.status !== 0) process.exit(prepared.status || 1);

const baseEnv = {
  ...process.env,
  GOOGLE_CLOUD_PROJECT: "aula-c-knowledge-jorge",
  AULA_C_AUTH_PROJECT: "aula-c-jorge",
  GCS_BUCKET: "aula-c-knowledge-jorge-774195700936",
  AULA_C_STORAGE_PREFIX: "dev",
  ALLOWED_ORIGINS: "http://127.0.0.1:5183,http://localhost:5183",
  GOOGLE_APPLICATION_CREDENTIALS: join(
    homedir(),
    ".config",
    "aula-c",
    "gcloud",
    "application_default_credentials.json",
  ),
};
if (!existsSync(baseEnv.GOOGLE_APPLICATION_CREDENTIALS)) {
  console.error("Falta ADC aislado de Aula C. Ejecútalo una vez con: npm run dev:auth");
  process.exit(1);
}
const children = [];

function start(command, args, env) {
  const child = spawn(command, args, { stdio: "inherit", env, shell: false });
  children.push(child);
  child.on("error", (error) => {
    console.error(`No se pudo iniciar ${command}: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code || 0);
  });
}

let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill("SIGTERM");
  setTimeout(() => process.exit(code), 300).unref();
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

start(
  "doppler",
  [
    "run",
    "--project",
    "dev-tools",
    "--config",
    "dev",
    "--only-secrets",
    "AULA_C_GEMINI_API_KEY",
    "--",
    "node",
    "api/server.mjs",
  ],
  { ...baseEnv, PORT: "5184" },
);
start("npm", ["run", "dev:web"], baseEnv);
console.log("Aula C: web http://127.0.0.1:5183 · API http://127.0.0.1:5184 · GCS dev/ (caduca en 7 días)");
