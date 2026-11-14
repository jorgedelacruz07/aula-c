import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const configDirectory = join(homedir(), ".config", "aula-c", "gcloud");
const credentialsPath = join(configDirectory, "application_default_credentials.json");
mkdirSync(configDirectory, { recursive: true, mode: 0o700 });

console.log(
  "Preparando credenciales locales de Aula C mediante impersonación; no se crea una llave de service account.",
);
const result = spawnSync(
  "gcloud",
  [
    "auth",
    "application-default",
    "login",
    "--impersonate-service-account=aula-c-docs-api@aula-c-knowledge-jorge.iam.gserviceaccount.com",
  ],
  { stdio: "inherit", shell: false, env: { ...process.env, CLOUDSDK_CONFIG: configDirectory } },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
chmodSync(credentialsPath, 0o600);
console.log("Listo: las credenciales aisladas están en ~/.config/aula-c/gcloud/ y no alteran el ADC global.");
