# AGENTS.md — Aula C

> **For AI agents (Antigravity, Claude Code, Codex, OpenCode).** Read `~/Projects/AGENTS.md` first (especially the GCP Zero-Cost Policy and Doppler-only secrets rules), then this file, `README.md`, `docs/ARQUITECTURA.md`, and `PROJECT_BRAIN/handoff.md`. Repository code and observed state outrank stale handoffs; `~/Projects/DEPLOYMENTS.md` and `~/Projects/WORKSPACE.md` hold cross-repo runtime topology and contract rules.

## 1. Repository Overview

- **Product:** Interactive C teaching guide, 42 progressive 3-tier practices (`Inicio` / `Aplicación` / `Reto`), 26 original university exercises (52 `.in`/`.out` cases), and in-browser WebAssembly/WASI C laboratory, plus a private document-ingestion admin pipeline.
- **Registry ID / Remote:** `aulac` · `jorgedelacruz07/aula-c` (formerly `C-Testing`).
- **Node Runtime:** `>=26` managed via **mise** (`.nvmrc` = `26`). Do not install or use `nvm`.
- **Host Authority:** Mac Mini holds the authoritative checkout and runs all tests/builds/deploys. MacBook Air is a Remote SSH client.
- **Branch Note:** Integrated repository code lives on **`master`** (`origin/HEAD` → `main` lags `master`). Check `git status` and branches before branching or opening PRs.

## 2. Architecture & Execution Boundaries

| Surface                   | Path                                            | Stack & Runtime                                                                   | Local Dev                              | Hosting / Target                                                      |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| Public Lab & Admin UI     | `web/`                                          | Vite 8, vanilla ESM, `@runno/wasi` 0.10.0, Firebase Auth client                   | `http://127.0.0.1:5183` (`strictPort`) | Firebase Hosting `aula-c-jorge` (`https://aula-c-jorge.web.app`)      |
| Documents API             | `api/`                                          | Node `>=26` ESM HTTP server, `@google-cloud/storage`, `firebase-admin`, `mammoth` | `http://127.0.0.1:5184` (loopback)     | Cloud Run `aula-c-docs-api` (`aula-c-knowledge-jorge`, `us-central1`) |
| C Content & Fixtures      | `lecciones/`, `ejercicios/`, `pruebas/`         | C17 lessons/practices; C89/academic-rule exercises                                | —                                      | Bundled into `dist/` by `scripts/prepare.mjs`                         |
| Native Toolchain / Legacy | `Makefile`, `herramientas/`, `Aula C.xcodeproj` | Host `clang`, `verificar_reglas.sh`, `/archivo.html` (local Tailwind)             | —                                      | Local academic verification (`npm run test:c`)                        |

### Key Invariants

- **In-browser C execution only:** `web/js/runner.js` (`CRunner`) runs `clang.wasm` + `wasm-ld.wasm` + `clang-fs.tar` (pinned by SHA-256 in `scripts/toolchain.json`, served from `/toolchain/<hash>/` with `Cache-Control: public, max-age=31536000, immutable` in `firebase.json`). `CRunner.runTests` compiles/links once per verification pass and reuses the resulting `/program.wasm` across test fixtures. Limits: 64 KiB C source, 4096 B UTF-8 stdin, 64 KiB combined output, 20 s compile/link, 3 s run, fresh virtual FS per execution.
- **Cross-Origin Isolation:** `web/index.html` and `web/archivo.html` require `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` (`vite.config.js` and `firebase.json`) for `SharedArrayBuffer` workers. `/admin` uses `same-origin-allow-popups` + `unsafe-none` for Firebase Google Sign-In. Keep assets self-hosted under COEP (no external CDN scripts in the lab).
- **Private API Boundaries (`api/server.mjs`, `api/security-baseline.mjs`):**
  - Never executes or compiles C code; no database is used.
  - `resolveListenHostname` binds `127.0.0.1` in `development`/`test` (fail-closed if `NODE_ENV` is missing/invalid outside Cloud Run `K_SERVICE`).
  - `/api/health` and `/health` return liveness-only JSON (`Cache-Control: no-store`, no internal diagnostics).
  - CORS uses `createCorsOriginPolicy` with exact HTTP(S) origins from `ALLOWED_ORIGINS`.
  - `/api/admin/*` verifies Firebase ID tokens (`email_verified === true` and authorized admin email); `/api/public/materials` exposes only explicitly published JSON under `published/`.
  - In `npm run dev`, `/admin` defaults to **Biblioteca principal** via Vite proxy `/library-api/*` → Cloud Run; **Pruebas locales** explicitly routes `/api/*` → `:5184` (`dev/` GCS prefix, 7-day TTL).

## 3. Quality Gates (by Side Effect)

Class legend: `R` = read-only · `W` = writes gitignored/temp files · `H` = heavy (native `clang` / Vite build) · `M` = mutates tracked files · `L` = long-running local server · `X` = external deploy/publish.

| Command                   |  Class  | Scope & Notes                                                                                                                                                                                           |
| ------------------------- | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`    |   `R`   | Prettier check across `api/`, `web/`, `scripts/`, `docs/`, `PROJECT_BRAIN/`, root configs, `README.md`.                                                                                                 |
| `npm test`                | `R/W/H` | `node --import ./scripts/test-network-guard.mjs --test scripts/*.test.mjs`. Enforces loopback-only network guard; compiles/runs C lessons, 42 practices, and 52 archive cases via `clang` in temp dirs. |
| `npm run prepare:content` |   `W`   | Verifies toolchain SHA-256 (`scripts/toolchain.json`), populates gitignored `web/public/`, builds `catalog.json` and `/archivo` Tailwind CSS.                                                           |
| `npm run build`           |  `W/H`  | `npm run prepare:content && vite build` → outputs gitignored `dist/`.                                                                                                                                   |
| `npm run quick`           | `R/W/H` | **Non-mutating on tracked files:** `format:check && test && build && git diff --check`. Run before commits and deploys.                                                                                 |
| `npm run quick:fix`       | `M/W/H` | Runs `npm run format` (rewrites tracked files), then `test && build && git diff --check`.                                                                                                               |
| `npm run test:c`          |  `W/H`  | `make verify anidados test_anidados` — academic rule checks (`herramientas/verificar_reglas.sh`), C89 `-pedantic`, and `.in`/`.out` suites (writes gitignored `build/`).                                |
| `npm run dev`             |   `L`   | Runs `prepare:content`, starts API (`127.0.0.1:5184` with `NODE_ENV=development` + Doppler `dev-tools/dev`) and Vite (`127.0.0.1:5183`).                                                                |
| `npm run deploy`          |   `X`   | Full deploy (`-- --api-only` / `-- --web-only` supported). Requires explicit user approval.                                                                                                             |

## 4. Deployment, Secrets & Zero-Cost GCP Policy

- **GCP & Firebase Topology:**
  - **Hosting & Auth:** Firebase Spark project `aula-c-jorge` (no billing linked; no App Hosting, no Cloud Functions, no Firestore).
  - **API & Storage:** Cloud Run `aula-c-docs-api` in `aula-c-knowledge-jorge` (`us-central1`, runtime SA `aula-c-docs-api@aula-c-knowledge-jorge.iam.gserviceaccount.com`, private bucket `gs://aula-c-knowledge-jorge-774195700936`, Secret Manager `aula-c-gemini-api-key`, Artifact Registry `aula-c-images/docs-api`).
  - **Gemini:** Free-tier API key (`AULA_C_GEMINI_API_KEY`) stored in Doppler `dev-tools/dev`.
- **Hard Rules:**
  - **$0.00 GCP posture:** Keep Cloud Run at `--min-instances=0`, `--max-instances=1`, `--cpu=1`, `--memory=1Gi`, `--concurrency=1`, `--cpu-throttling`, `--no-cpu-boost`. Never add Cloud SQL/managed DBs, App Hosting, Vercel, or Cloud Build (`gcloud run deploy --source .`).
  - **No CI/CD auto-deploys:** Do not add GitHub Actions `push`/`pull_request` deploy workflows.
  - **Secrets:** Doppler-only (`dev-tools/dev`). Never create `.env*` files, commit credentials, or download service-account JSON keys. Local dev uses isolated impersonated ADC via `npm run dev:auth` (`~/.config/aula-c/gcloud/`).
  - **Canonical Deploy Safety (`scripts/deploy.mjs`, `scripts/deploy-api.mjs`):** Requires a clean git working tree (no `-dirty` tags), builds `linux/amd64` locally via Docker, cross-checks `docker push` `@sha256:` digest with Artifact Registry, refuses first-time service deploys without `--first-deploy`, deploys `--no-traffic --tag=candidate`, probes `/api/health` for HTTP 200 before promoting traffic, and checks zero-cost annotations. Secret sync (`--sync-secret`) and AR cleanup policy mutation (`--apply-ar-policy`) are opt-in (`--dry-run` by default).

## 5. Continuity, Skills & Agent Rules

- **Authoring Skill:** Follow `.agents/skills/aulac-exercise-author/SKILL.md` when adding or modifying lessons, 3-tier practices, or catalog exercises. Preserve existing `ejercicios/` sources and `pruebas/` fixtures.
- **Continuity Sources:** Track active decisions and verified handoff state in `PROJECT_BRAIN/handoff.md` and `PROJECT_BRAIN/ledger.md`, plus `office_tasks` when assigned.
- **Explicit Approval Gates:** Do not `git push`, deploy/publish (`npm run deploy` or `/admin` publish), add/upgrade npm dependencies, or change GCP/IAM/Doppler config without explicit user approval.
- **Commits:** Always end commit messages with `Co-authored-by: OpenBot <335604065+openbotgit[bot]@users.noreply.github.com>` unless explicitly told otherwise.
