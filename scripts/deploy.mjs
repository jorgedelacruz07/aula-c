import { spawnSync } from "node:child_process";
const project = process.env.FIREBASE_PROJECT;
if (process.env.CONFIRM !== "DEPLOY" || !project || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(project)) {
  console.error(
    "Selecciona un proyecto Firebase existente y autoriza la publicación:\nCONFIRM=DEPLOY FIREBASE_PROJECT=<id> npm run deploy\nConsulta docs/ARQUITECTURA.md. Este comando no crea proyectos ni activa facturación.",
  );
  process.exit(1);
}
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
