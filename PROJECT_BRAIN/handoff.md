# Handoff · Aula C

## Actualización 2026-11-14 · Ingesta de documentos en producción

La adición estática del 2026-11-13 queda como antecedente histórico; el estado actual incluye backend de documentos.

- Producción: Firebase Hosting/Auth Spark en https://aula-c-jorge.web.app y Cloud Run `aula-c-docs-api` en el proyecto facturable `aula-c-knowledge-jorge`. API: https://aula-c-docs-api-uwwafcckza-uc.a.run.app.
- Bucket privado `gs://aula-c-knowledge-jorge-774195700936`; Secret Manager y Artifact Registry separados en ese proyecto. Gemini usa cuota gratuita en `gen-lang-client-0329030513`. La facturación del backend puede generar cargos; Cloud Run está en min=0, max=1 efectivo a nivel de servicio, CPU throttling, 1 vCPU y 1 GiB.
- API verificada: health 200 con configuración GCS y clave Gemini presentes; catálogo público vacío (0 materiales); endpoint administrativo anónimo devuelve 401. La web de administración responde 200. Google Sign-In está activado; la sesión interactiva del propietario y la primera generación real de Gemini aún no se han probado.
- Tipos: PDF, DOCX, TXT y Markdown. Fuente y borradores son privados; el docente edita y confirma publicación. El API no ejecuta C. La carpeta de objetos de desarrollo vence a los 7 días.
- Switchboard comparte el catálogo `aulac`: web `5183`, API `5184`. Actualizados `project-dev`, túnel SSH y los documentos fuente del workspace.
- ProjectsDocs privado se regeneró correctamente desde fuentes canónicas; auditoría pasó, con aviso de 93 enlaces no resueltos ya incluidos en su informe. No se publicó la copia pública.
- Repo Aula C limpio y sincronizado: cambios publicados en `master`, commit `76c33db5881c4f4d5d4e99837dd482bf7c959e0c`. El portal público de ProjectsDocs no se publicó.

Fecha: 2026-11-13. Base Git C-Testing: `4486fd8`; implementación local sin commit de esta sesión.

## Entrega

- Web pública: <https://aula-c-jorge.web.app>. Proyecto y sitio Firebase exclusivos `aula-c-jorge` (número `335432240132`). Sin cuenta de facturación vinculada: `billingEnabled=false`, comprobado con gcloud.
- Desarrollo: `npm run dev` → `127.0.0.1:5183`, strictPort. Se detectó un servidor de este repo ya activo y se reutilizó; no se detuvieron procesos existentes.
- Comandos: `format`, `quick`, `test:c`, `build`, `deploy`. Publicación: `npm run deploy` (por defecto `aula-c-jorge`).
- 14 lecciones / 22 casos nuevos; 26 ejercicios / 52 casos originales. Teoría, glosario, preguntas docentes, retos abiertos, editor, stdin, diagnósticos, cancelación, descarga/importación y progreso local.
- Ejecución C real con Clang 8 y WASI en workers. Límites y diferencias frente a Xcode documentados. Archivos efímeros; no hay API de ejecución nativa.
- Firebase Hosting estático; no Functions, Cloud Run, App Hosting, bases de datos, claves nuevas ni facturación habilitada.

## Evidencia

- Verificación independiente: `npm run quick` y `npm run test:c`, ambos exit 0. Gate quick repetido tras arreglar estilos del archivo de mentoría: exit 0.
- 5 pruebas Node: teoría y símbolos completos, comparación de salida/estado, tar seguro, 22 casos de lecciones y 52 originales compilados/ejecutados con Clang nativo en temporales.
- Navegador local: 74 casos (22 nuevos + 52 originales) correctos con el runner WebAssembly; errores de compilación, stdin vacío/EOF, timeout de bucle, modo docente, filtrado, verificación y retiro de progreso al editar. Diseño comprobado en 1440 px y 390 px, sin desbordamiento horizontal móvil.
- Web pública: COOP/COEP activos y `crossOriginIsolated=true`; `Hola, C!` y `Leido: 42` correctos. El archivo de mentoría se conserva en `/archivo.html`; sus utilidades Tailwind se compilan localmente para evitar bloqueo CORS bajo COEP.
- Revisión independiente sin hallazgos P0/P1. Corregidos: borrado de copias generadas obsoletas; Tab no modifica textarea readonly; guard de versión al importar; límites medidos en bytes UTF-8.
- Controles académicos: pasan reglas, C89 y casos originales. `b4.c` conserva tres advertencias C89 preexistentes, permitidas por el gate actual.

## Integración y documentación

- Meta-repo: catálogo `aulac` / `Aula C` / `5183` (antes `ctesting` / `C-Testing`; alias `ctesting` conservado en `project-remote`), dispatch individual y all, registro canónico y enlace production; proyecciones generadas con `workspace:sync`.
- Configuración versionada Air: forward loopback `5183`, diagnóstico de túneles, URL y claves del launcher remoto. No se reiniciaron túneles ni se instaló Switchboard. La configuración debe llegar al checkout del Air por su flujo normal; conexiones ya abiertas conservan su conjunto de forwards hasta reconectar.
- ProjectsDocs toma README, documentación y ficha Vault desde sus fuentes canónicas. Al cierre se usa su pipeline privado existente para regenerar y auditar; no se publica la biblioteca pública de Funnel.
- Vault: `02-Projects/Aula C/Aula C.md`, intención docente, método y navegación. No se copiaron manuales del repo.
- Cierre del meta-repo: `queue:ledger add` fue rechazado con `HOST_NOT_OWNER` (autoridad `Jorges-MacBook-Air.local`, ejecución `Jorges-Mac-Mini.local`). Se conservó el rechazo y no se cambió la propiedad ni se usó un bypass. La implementación queda registrada en el ledger de C-Testing; el asiento global debe reconciliarse desde el host propietario.
- Se observaron commits externos de integración en el meta-repo durante la sesión; se preservaron. Esta sesión no ejecutó commit ni push.

## Siguiente trabajo

Incorporar el material concreto del propietario con procedencia, semestre, restricciones y permiso de publicación. Ampliar búsqueda/ordenamiento y estructuras dinámicas antes de considerar el tramo avanzado completo. Los retos son abiertos: pasar los casos de referencia no certifica dominio ni corrige automáticamente la variante propuesta.

Fuentes: `docs/ARQUITECTURA.md`, `docs/PLAN-DOCENTE.md`, `docs/CONTRATO-WEB.md`. C-Testing no dispone de perfil de cola; el trabajo se registra aquí y en `ledger.md`, sin inventar uno.

## 2026-11-13 · Legibilidad y renombre a Aula C

- UX: escala mínima de 14 px para lectura y controles (12 px solo en etiquetas en mayúsculas), flechas ↗ decorativas retiradas de navegación y tarjetas (se mantienen solo en enlaces externos), emoji del modo docente retirado, `color-scheme` por tema.
- Renombre: carpeta `~/Projects/Aula C`, repo `jorgedelacruz07/aula-c` (origin actualizado), paquete `aula-c`, `Aula C.xcodeproj`, catálogo/launcher `aulac`, ficha Vault `02-Projects/Aula C/`, proyecto T3 «Aula C». Puerto 5183 y Firebase `aula-c-jorge` sin cambios.
- Pendiente en el MacBook Air: renombrar su copia local a `~/Projects/Aula C` y `git remote set-url origin git@github.com:jorgedelacruz07/aula-c.git`.
