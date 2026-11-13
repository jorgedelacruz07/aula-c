# Contratos de implementación · 2026-11-13

Autorización: solicitud del propietario para una guía práctica de C en web, comandos npm, integración con Switchboard y actualización de ProjectsDocs y Vault.

## C-Testing

- Repositorio: `~/Projects/C-Testing`. Responsable: sesión principal.
- Objetivo: plataforma local y exportable a Firebase Hosting, con teoría, ejemplos comentados, editor, entrada estándar y ejecución C aislada en el navegador.
- Rutas autorizadas: `web/`, `lecciones/`, `scripts/`, `docs/`, `PROJECT_BRAIN/`, configuración npm/Vite/Firebase, README, Makefile y exclusiones de artefactos.
- Preservar los ejercicios, pruebas y proyecto Xcode existentes; conservar la plataforma anterior como archivo accesible.
- Aceptación: ruta progresiva, símbolos explicados, ejercicios filtrables, ejecución real de C con cancelación y diagnósticos, casos verificables y descarga de fuentes; `dev` en loopback `5183`, `format` y `quick` reproducibles.
- Gates: formato y sintaxis (R), tests Node y C en temporales (W descartable), build estático (W generado). Ejecutar en Mini. Revisión independiente de cambios.
- Extensión autorizada por el propietario: «Crea tú mismo el proyecto en Firebase». Crear un proyecto exclusivo sin facturación vinculada y publicar únicamente Firebase Hosting desde `npm run deploy`. No activar Blaze, Functions, Cloud Run ni App Hosting.

## Projects / integración Switchboard

- Repositorio: `~/Projects`. Responsable: sesión principal, secuencial tras implementación.
- Cambios: entrada `ctesting` del launcher `project-dev.sh`, registro canónico, proyecciones mediante `workspace:sync`, README y topología. Para el cliente Air, forward loopback `5183` en `config/ssh/multimac.conf`, URL/diagnóstico/claves de `project-remote.sh` y pruebas aisladas; sin reiniciar conexiones existentes.
- Aceptación: catálogo TSV de Switchboard contiene C-Testing/5183 y registro sin drift; pruebas aisladas del launcher pasan.
- No instalar/reiniciar Switchboard ni afectar servidores existentes.

## ProjectsDocs

- Repositorio: `~/Projects/ProjectsDocs`. Responsable: sesión principal, secuencial.
- Cambios: proyección generada del registro; regenerar biblioteca privada desde fuentes canónicas con scripts existentes.
- Aceptación: documentación C-Testing visible en contenido generado y `check` correcto. Sin publicación pública ni reinicios.

## Jorge's Vault

- Repositorio: `~/Projects/Jorge's Vault`. Responsable: sesión principal, secuencial.
- Cambios: una ficha `02-Projects/C-Testing/` y enlace de navegación pertinente.
- Aceptación: conocimiento personal y estrategia docente enlazan al repo, sin duplicar manuales operativos; YAML y enlaces correctos.

## Cierre

Preservar cambios ajenos, registrar comprobaciones reales y limitaciones en ledger/handoff. No commit, push, despliegue ni cambios de credenciales. El proyecto no tiene perfil de cola: registrar ledger local, sin inventar una cola.
