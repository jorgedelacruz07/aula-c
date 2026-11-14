# Handoff · Aula C

## Publicación de ejercicios resueltos · 2026-11-14

- Autorización expresa: «haz commit, push a master y deploy a prod».
- Código y documentación de las 42 prácticas, navegación por lección y soluciones por defecto confirmados en `20bd502` y enviados a `origin/master`.
- Gate final: `npm run quick` exit 0, 25/25 pruebas, 165 casos nuevos, 52 del archivo, formato, build y diff check. Revisión independiente de política sin hallazgos materiales; sin cambios de API/runner/dependencias/infraestructura.
- Despliegue mediante `npm run deploy -- --web-only`: Auth + Hosting `aula-c-jorge` publicados con la URL del API existente. Producción: <https://aula-c-jorge.web.app>.
- Verificación pública: tres HTML, nueve assets JS/CSS y las 42 soluciones C (54 recursos) coinciden por SHA-256 con `dist`; todas las rutas devolvieron 200. Cabeceras COOP/COEP correctas para compilador y popup de acceso. Las soluciones no contienen TODO.
- API: health 200 con configuración de almacenamiento/IA presentes; administración anónima 401; materiales públicos 200 y CORS válido. Los ocho documentos continúan privados, con cero materiales aprobados publicados.
- Este bloque reemplaza el estado local de las entradas anteriores; el cierre documental se confirma después del despliegue. No se realizó una revisión visual en navegador en esta publicación.

## Ejercicios resueltos como referencia docente · 2026-11-14 · cambios locales

- Solicitud: presentar los ejercicios resueltos según tema/nivel para explicar en Aula C; el alumno construye los programas en su laptop personal.
- Las 42 prácticas ahora abren su solución C17 completa y comentada en el editor. El panel muestra desarrollo, contrato, casos, descarga directa del `.c` e indicaciones para reconstrucción con Xcode o GCC/Clang. El catálogo del archivo también se describe como ejercicios resueltos.
- Plantillas conservadas como opción secundaria mediante «Abrir plantilla opcional» / «Ver solución comentada». Su ruta original `practicas/<id>.c` conserva borradores anteriores; la referencia usa `lecciones/practicas/<id>.c`, evitando que un borrador antiguo con TODO la reemplace. «Restaurar solución» recupera el C original.
- Se mantiene el alcance de tres prácticas por lección y la navegación global superior/lateral. Los materiales son propuestas propias orientadas por las fuentes, sin atribuirlas a un solucionario oficial.
- Evidencia: `npm run quick` exit 0, 25/25 pruebas; 165 casos nuevos, 52 casos del archivo y build. Las 42 rutas por defecto coinciden por HTTP con las soluciones locales y no contienen TODO. Soluciones y plantillas compilan con C17 y advertencias como errores. Sin commit/push/deploy.

## Navegación de prácticas simplificada · 2026-11-14 · cambios locales

- Corrección solicitada: el panel de una lección permitía explorar otros temas y duplicaba los filtros superiores/sidebar.
- Ahora presenta únicamente las tres prácticas de la lección activa, sin selectores de alcance/nivel/dificultad ni búsqueda interna. El progreso cuenta solo esas tres prácticas. La navegación entre temas se mantiene en los filtros superiores y la lista lateral; la búsqueda superior se etiqueta «Buscar lección o práctica».
- Eliminados el filtrado global interno y el scroll anidado de tarjetas. Se conservan Inicio/Aplicación/Reto, el retorno al ejemplo, borradores y soluciones opcionales.
- Verificación: dos pruebas de regresión del componente pasan; comprueban las 14 lecciones, progreso local, selección de práctica, retorno al padre y rechazo de una tarjeta de otra lección. Build Vite correcto; las fuentes C y sus casos permanecen sin cambios respecto de la verificación anterior. Sin commit/push/deploy.

## Prácticas por tema · 2026-11-14 · cambios locales

- Solicitud: ampliar «Aprende haciendo · La teoría, al lado del código» con ejercicios de diferentes dificultades acordes a las guías y referencias universitarias.
- Resultado: 42 prácticas propias, tres por cada lección (Inicio/Aplicación/Reto), con 165 casos; 15 de contenidos básicos, 12 intermedios y 15 avanzados. Plantillas incompletas, contratos, pistas, soluciones comentadas separadas y guía docente por ejercicio.
- Banco integrado en el laboratorio: tema actual o todos los temas, filtros de nivel/dificultad y búsqueda; conserva relación con la lección y borradores/verificaciones independientes. Consultar la solución no sobrescribe el editor. La ruta `?leccion=practica-...` restaura la práctica.
- Archivos: `web/js/practice-content/`, `web/js/practices.js`, `web/js/practice-ui.js`, `web/css/practices.css`, `web/js/aula.js`, `web/index.html`, `lecciones/practicas/`, dos suites nuevas y documentación. Catálogo y referencias en `docs/PRACTICAS.md`; PDF y borradores privados conservan su flujo de aprobación.
- Verificación: `npm run quick` exit 0, 26/26 pruebas; soluciones C17 y plantillas con advertencias como errores, 165 casos nuevos, 52 del archivo y build Vite. HTTP local 200 y las 42 soluciones coinciden con el C local; IDs y sintaxis comprobados. Sin revisión visual en navegador. Aviso existente de Browserslist desactualizado.
- Revisión independiente: corregido el dominio de `practica-11-promedio` a 500 mediciones para caber en los 4096 bytes de stdin. Añadidos máximo válido (3004 bytes), rechazo de 501 e invariantes de tamaño en fixtures/plantillas. Segunda ejecución de quick pasó tras corregirlo.
- Base git: `5e0507a`. Esta ampliación está en el árbol local; no se hizo commit, push ni despliegue en esta solicitud. La publicación anterior descrita abajo conserva su evidencia histórica.

## Publicación completa · 2026-11-14

- Solicitud expresa: commit, push a master y despliegue a producción. Se incluyeron los tres archivos de interfaz pendientes (CSS, HTML y lógica del laboratorio), confirmados en `6981b28`; master enviado a origin.
- `npm run quick` pasó con 21 pruebas y build. Sintaxis JS, IDs únicos y referencias de selectores estáticos comprobados.
- `npm run deploy` completó Docker local → Artifact Registry → Cloud Run y Firebase Auth/Hosting. API activa: `aula-c-docs-api-00008-65b` con 100 % del tráfico, min=0/max=1, CPU throttling, 1 vCPU/1 GiB.
- Verificación pública: `/`, `/admin` y `/archivo` devolvieron 200; sus HTML y ocho assets JS/CSS coinciden por SHA-256 con el build publicado. Cabeceras de aislamiento del laboratorio y compatibilidad de popup de administración comprobadas.
- API: health 200 con GCS/Gemini configurados, administración anónima 401, catálogo público 200 con CORS correcto. Los documentos continúan como borradores privados; el despliegue no los publica.

## Actualización 2026-11-14 · Administración local y biblioteca compartida

- Causa: `npm run dev` consulta `dev/` en GCS, mientras los ocho documentos procesados por el asistente están en la biblioteca principal. No eran visibles en la administración local.
- `/admin` local ahora abre **Biblioteca principal** por defecto; Vite proxy `/library-api` reenvía al API Cloud Run y conserva la autenticación Firebase. **Pruebas locales** sigue disponible por selección explícita y conserva su prefijo temporal `dev/`.
- No se copian originales ni borradores a la zona que caduca. El selector indica que los cambios de la biblioteca principal se comparten con la web publicada. Las solicitudes bloquean cambios de biblioteca y el cambio limpia la selección para evitar mezclar documentos.
- Comprobación: Vite recargó su configuración y la ruta local devolvió 401 sin sesión (requiere Google); en el navegador se observó la selección principal por defecto. Esa ventana de prueba no tenía sesión del propietario. Los ocho registros de la biblioteca principal se verificaron aparte en GCS.
- `npm run quick` pasó con 21 pruebas y build. Se conservaron los cambios de interfaz previos. Esta corrección se activa en desarrollo; no requiere cambiar Cloud Run, bucket ni sus reglas de acceso.

## Actualización 2026-11-14 · Seis fuentes de fundamentos incorporadas

- Incorporados los seis PDF adjuntos de 1INF01/PUCP 2026-2: guías 1, 2, 3, 4, 5/6 y taller del parcial. Son 309 páginas, 17 lecciones, 22 ejercicios y 64 casos propuestos; quedan como borradores privados. Biblioteca documental acumulada: ocho fuentes, 398 páginas. Inventario y progresión: `docs/FUENTES-DOCENTES.md`.
- Se verificaron por SHA-256 los seis originales almacenados contra los adjuntos, los campos internos de cada borrador, las referencias dentro del rango de páginas y comentarios en todos los programas. Las 17 lecciones tienen apertura, preguntas, errores, rúbrica y pizarra.
- Curación: precedencia frente a orden de evaluación; paso por valor y copia de direcciones en C; recurrencia matemática frente a recursión. Se completó la guía docente y se alinearon niveles con la ruta. La exactitud de los programas y sus 64 salidas propuestas aún necesita revisión docente; no se ejecutaron esos casos.
- Fuentes privadas: `34a76d9e-31dc-4ab1-b717-6b019204033a` (guía 1), `7a7b6eaa-1c74-467c-bf3f-a188e767887b` (2), `a48af30e-b71a-47a9-a547-3725f782a1df` (3), `ddeba164-0bdf-428c-8716-fa7155a0a4ff` (4), `127c729e-d2a0-442b-9db6-e4b0da1c12d6` (5/6), `49177b74-4299-4854-835e-3256f85153b9` (taller). Metadatos bajo `documents/<id>/` en el bucket de Aula C; originales y borradores nunca se agregan a Git.
- Integración `f4cc17a`: el catálogo publicado usa el API configurado, y `web/js/materials.js` conserva explicaciones propias de símbolos, casos y guía docente al cargar recursos en el laboratorio. Hosting actualizado con `npm run deploy -- --web-only` desde un checkout limpio; se preservaron fuera del despliegue los cambios previos de interfaz.
- Generación `371ac32`: campos docentes obligatorios y recuperación cuando faltan; API desplegado con `npm run deploy -- --api-only`, revisión `aula-c-docs-api-00007-vnr` al 100 %, min=0/max=1, CPU throttling. Health 200.
- Verificación: `npm run quick` exit 0, 18 pruebas y build. Assets de Hosting y CORS del API comprobados; los seis borradores privados se volvieron a leer y validar desde GCS. El catálogo público sigue en cero materiales al cierre.
- El siguiente paso docente es revisar y publicar los borradores desde `/admin`. El registro de fuentes ofrece una progresión para el aula, no una afirmación de conversión exhaustiva de todas las páginas.

## Actualización 2026-11-14 · PDF reales recuperados

- Causa reproducida: el Laboratorio 10 generaba `MAX_TOKENS`; de 12.000 tokens de salida, Gemini consumía 7.624 en razonamiento y cortaba el JSON. El archivo PDF original era válido.
- Corrección en `177897d`: razonamiento limitado a 1.024 tokens, salida de hasta 24.576, esquema acotado a 3 lecciones/4 ejercicios, validación interna y un reintento compacto como máximo con plazo total de 180 s. Los errores distinguen cuota, timeout y salida incompleta; un éxito limpia el error anterior.
- Producción: `npm run deploy -- --api-only`; revisión `aula-c-docs-api-00006-n52` al 100 %, min=0, max=1, CPU throttling, 1 vCPU/1 GiB. Health 200 y administración anónima 401. Se conservaron fuera del commit/deploy los cambios previos de `web/css/aula.css`, `web/index.html` y `web/js/aula.js`.
- Prueba real con los PDF autorizados: Laboratorio 10 (21 páginas) → 3 lecciones y 4 ejercicios; guía #8/#9 (68 páginas) → 3 lecciones y 3 ejercicios. Ambos terminaron con `STOP`, JSON válido, referencias dentro del número de páginas y campos docentes.
- GCS: original del laboratorio reutilizado y su borrador recuperado en `documents/e4f9c80f-4579-4ea5-807f-d885b6328554/`. La guía adjunta se incorporó como borrador privado en `documents/82e486d1-2048-4516-8ed9-c88e953aff59/`. Ninguno se publicó; `/api/public/materials` sigue vacío. Los ejemplos/casos generados requieren revisión docente antes de publicarse.
- Verificación: `npm run quick` exit 0 (13 pruebas y build), arranque de imagen Docker linux/amd64 con health 200/401 anónimo. Las pruebas simulan truncamiento, JSON incorrecto, cuota, bloqueo, UTF-8 y recuperación del objeto original.

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
