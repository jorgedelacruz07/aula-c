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

## Ajuste autorizado: legibilidad y nombre Aula C

Solicitud 2026-11-13: corregir textos demasiado pequeños e iconos repetidos sin rediseñar la estética; renombrar carpetas, referencias activas, repositorio GitHub y Switchboard a Aula C.

- App: escala legible (lectura 16 px, código 15 px, controles 14–16 px y metadatos mínimo 12 px), ambos temas, archivo PUCP y modo docente. Preservar ejercicios y cambios anteriores.
- Identidad: carpeta `~/Projects/Aula C`, repositorio `jorgedelacruz07/aula-c`, paquete `aula-c`, registro/launcher `aulac`; puerto 5183 y proyecto Firebase existentes.
- Meta-repo: rutas y claves activas en launcher/remoto/workflow/tests/configuración versionada; proyecciones mediante `workspace:sync`. Documentos históricos conservan su fecha y procedencia.
- Vault/ProjectsDocs: renombrar la ficha de proyecto, corregir navegación y regenerar desde fuentes, sin duplicar manuales.
- T3: actualizar título y carpeta del proyecto existente, conservando hilos. Xcode: renombrar el contenedor de proyecto conservando target y fuentes.
- Validación: quick, reglas C, pruebas de integración afectadas, tamaños computados y flujos en navegador claro/oscuro/móvil. Publicar por `npm run deploy` al destino ya autorizado.
- La migración exige reiniciar únicamente el servidor de este proyecto desde la nueva carpeta; queda autorizada como parte necesaria del cambio solicitado. No reiniciar otros proyectos ni instalar Switchboard.
- Sin commits ni push de código. Renombrar el repositorio remoto y actualizar origin sí está expresamente solicitado.
