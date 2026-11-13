# Handoff · Aula C

Fecha: 2026-11-13. Base Git C-Testing: `4486fd8`; implementación local sin commit de esta sesión.

## Entrega

- Web pública: <https://aula-c-jorge.web.app>. Proyecto y sitio Firebase exclusivos `aula-c-jorge` (número `335432240132`). Sin cuenta de facturación vinculada: `billingEnabled=false`, comprobado con gcloud.
- Desarrollo: `npm run dev` → `127.0.0.1:5183`, strictPort. Se detectó un servidor de este repo ya activo y se reutilizó; no se detuvieron procesos existentes.
- Comandos: `format`, `quick`, `test:c`, `build`, `deploy`. Publicación autorizada: `CONFIRM=DEPLOY FIREBASE_PROJECT=aula-c-jorge npm run deploy`.
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

- Meta-repo: catálogo `ctesting` / `C-Testing` / `5183`, dispatch individual y all, registro canónico y enlace production; proyecciones generadas con `workspace:sync`.
- Configuración versionada Air: forward loopback `5183`, diagnóstico de túneles, URL y claves del launcher remoto. No se reiniciaron túneles ni se instaló Switchboard. La configuración debe llegar al checkout del Air por su flujo normal; conexiones ya abiertas conservan su conjunto de forwards hasta reconectar.
- ProjectsDocs toma README, documentación y ficha Vault desde sus fuentes canónicas. Al cierre se usa su pipeline privado existente para regenerar y auditar; no se publica la biblioteca pública de Funnel.
- Vault: `02-Projects/C-Testing/C-Testing.md`, intención docente, método y navegación. No se copiaron manuales del repo.
- Cierre del meta-repo: `queue:ledger add` fue rechazado con `HOST_NOT_OWNER` (autoridad `Jorges-MacBook-Air.local`, ejecución `Jorges-Mac-Mini.local`). Se conservó el rechazo y no se cambió la propiedad ni se usó un bypass. La implementación queda registrada en el ledger de C-Testing; el asiento global debe reconciliarse desde el host propietario.
- Se observaron commits externos de integración en el meta-repo durante la sesión; se preservaron. Esta sesión no ejecutó commit ni push.

## Siguiente trabajo

Incorporar el material concreto del propietario con procedencia, semestre, restricciones y permiso de publicación. Ampliar búsqueda/ordenamiento y estructuras dinámicas antes de considerar el tramo avanzado completo. Los retos son abiertos: pasar los casos de referencia no certifica dominio ni corrige automáticamente la variante propuesta.

Fuentes: `docs/ARQUITECTURA.md`, `docs/PLAN-DOCENTE.md`, `docs/CONTRATO-WEB.md`. C-Testing no dispone de perfil de cola; el trabajo se registra aquí y en `ledger.md`, sin inventar uno.
