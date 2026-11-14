# Aula C: arquitectura y publicación

## Ejecución

La web pública se compila con Vite y el laboratorio C sigue ejecutándose en `@runno/wasi` 0.10.0 dentro del navegador. El API Node.js separado solo administra documentos didácticos; nunca compila ni ejecuta código C y no usa una base de datos.

El código de integración está en `web/js/runner.js`. Es una adaptación del pipeline C de [Runno](https://github.com/taybenlor/runno/blob/main/packages/runtime/lib/commands.ts), usando su biblioteca WASI MIT. Los binarios de [wasm-clang](https://github.com/binji/wasm-clang) se obtienen de `https://runno.dev/langs` y se fijan por SHA-256 en `scripts/toolchain.json`. `prepare:content` rechaza cambios de integridad; no actualiza hashes automáticamente. Caché descargada y salida generada están ignoradas por Git.

El navegador descarga aproximadamente 50 MB de compilador y 9 MB de bibliotecas sin comprimir la primera vez que se usan. No se precargan los binarios en la portada. No se garantiza uso sin conexión ni se instala un service worker. El servidor de desarrollo escucha solo en `127.0.0.1:5183` y falla si el puerto está ocupado. No busca otro puerto silenciosamente.

### Límites observables

- Cada compilación y enlazado tiene un máximo de 20 segundos; cada programa, 3 segundos.
- Botón Detener: aborta la carga pendiente o termina el worker activo. También se cancela al cambiar de programa.
- Código hasta 64 KiB, entrada UTF-8 hasta 4096 bytes y salida acumulada hasta 64 KiB. Estos límites reducen abusos y errores; no son una cuota rígida de memoria del navegador.
- stdin siempre termina con EOF, incluso sin datos. No hay consola interactiva durante la ejecución.
- Sistema de archivos virtual nuevo por ejecución; el código no recibe acceso a archivos del Mac. No persiste archivos virtuales después de correr.
- Clang web 8/WASI y Clang actual/macOS no son equivalentes: tipos, biblioteca y funciones del sistema pueden diferir. El ejemplo de archivos explica la ruta absoluta requerida por este WASI. `tmpfile` no está implementado.
- C17 y C89 con advertencias `-Wall -Wextra -pedantic`. Elegir C89 no aplica las restricciones académicas del material PUCP; `make reglas` conserva ese control.
- Las lecciones tienen casos de referencia. Los retos propuestos no tienen corrección automática propia; pasar el ejemplo no acredita el reto ni dominio docente.

## Contenido y progreso

`lecciones/*.c` es la fuente de los ejemplos nuevos. `web/js/curriculum.js` mantiene teoría, símbolos, errores frecuentes, guion docente, retos y casos. `web/js/learning.js` explica los símbolos según contexto. Los archivos originales de `ejercicios/` conservan sus comentarios y los 52 casos `.in/.out` existentes se incorporan al catálogo.

`scripts/prepare.mjs` genera `web/public/`: copia material y bibliotecas y genera el catálogo. También descubre archivos `.c` nuevos dentro de `ejercicios/`; infiere el nivel desde `basico/` o `avanzado/`, usa Intermedio por defecto y muestra «sin pruebas» cuando no hay fixtures. Para añadir teoría detallada, registra una lección con su fuente en el currículo. No se publica el directorio completo del repositorio: Git, instrucciones privadas, Xcode y docs quedan fuera de `dist`.

«Abrir .c» lee un archivo local de hasta 64 KiB en el editor. No sube el código a un servidor. Los borradores y casos verificados usan `localStorage`, pertenecen a ese navegador y no se sincronizan entre dispositivos. Editar una lección retira su marca de verificación. Se puede descargar el texto editado como `.c` y depurarlo en Xcode. La plataforma anterior permanece en `/archivo.html`; su resaltado Prism conserva un CDN y requiere Internet.

## Firebase Hosting

Sí es viable usar [Firebase Hosting estático](https://firebase.google.com/docs/hosting/quickstart): se publica únicamente `dist/`. El compilador también se sirve como recurso estático. La configuración está preparada en `firebase.json`, con las cabeceras que necesita SharedArrayBuffer:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Vite aplica las cabeceras COOP/COEP en local. El proyecto Firebase `aula-c-jorge` aloja la web y Google Authentication. El API corre en `aula-c-knowledge-jorge` mediante Cloud Run; el propietario autorizó vincular una cuenta de facturación para GCS y servicios de ejecución. No se usa Firebase Functions, App Hosting ni base de datos.

### Ingesta y publicación de documentos

- `web/admin.html` autentica con Firebase Google Sign-In. El API verifica el ID token en cada ruta privada y vuelve a comprobar que `email_verified=true` y el correo exacto sea `jdelacruzp7@gmail.com`.
- PDF, DOCX, TXT y Markdown se envían al API autenticado con límite de 25 MiB. Los objetos fuente y borradores son privados en `gs://aula-c-knowledge-jorge-774195700936`; el bucket usa acceso uniforme, prevención de acceso público y ciclo de vida que borra `dev/` a los 7 días.
- Gemini procesa los documentos usando una API key de `gen-lang-client-0329030513`, proyecto sin facturación. PDF conserva citas por páginas; DOCX/TXT/Markdown usan referencias de sección y no inventan páginas. La cuota gratuita puede limitar la disponibilidad.
- El análisis envía el documento completo y solicita una selección representativa de hasta 3 lecciones y 4 ejercicios, con teoría, símbolos, código comentado, guía docente y casos. La salida está acotada en el esquema y el prompt; no se promete una transcripción exhaustiva.
- Gemini 2.5 Flash usa `maxOutputTokens=24576` y `thinkingBudget=1024`: el razonamiento no puede agotar por sí solo el espacio destinado al JSON. Se comprueba `finishReason` antes de aceptar la respuesta. `MAX_TOKENS`, JSON mal formado o datos incompletos activan como máximo un reintento con hasta 2 lecciones y 2 ejercicios, dentro de un plazo compartido de 180 segundos.
- El servidor valida campos internos, referencias y casos antes de guardar o publicar. No repara JSON truncado agregando llaves ni guarda respuestas parciales. Los errores distinguen cuota, conexión, tiempo y salida incompleta; quedan registrados en los metadatos privados sin contenido del documento ni credenciales. Un reanálisis exitoso limpia el error anterior.
- La generación exige apertura docente, preguntas, errores frecuentes, rúbrica y pizarra para cada lección. Si faltan, se activa el reintento; los borradores manuales existentes mantienen su compatibilidad.
- La IA genera material original y un borrador privado. El docente edita y confirma su revisión antes de publicar. Solo los JSON publicados bajo `published/` se exponen en `/api/public/materials` y se consumen en el aula; no se publican los archivos originales.
- La web obtiene el catálogo desde `VITE_AULA_API_URL` en producción y desde el proxy `/api` en local. `web/js/materials.js` adapta el material aprobado al laboratorio: conserva código, stdin/salidas esperadas, explicaciones de símbolos del documento y la apertura, preguntas, errores, rúbrica y pizarra del Modo docente.
- La API key es fuente de verdad en Doppler `dev-tools/dev`; durante el despliegue se sincroniza de stdin a Secret Manager `aula-c-gemini-api-key`. Cloud Run usa Application Default Credentials con `aula-c-docs-api@aula-c-knowledge-jorge.iam.gserviceaccount.com`; no hay llaves de service account.
- Cloud Run está configurado a escala cero en reposo, una instancia máxima, concurrencia 1, 1 vCPU/1 GiB y CPU throttling. Esto reduce cómputo ocioso, pero no garantiza gasto total cero: GCS, red, Secret Manager, Artifact Registry y solicitudes pueden generar cargos.

Con Firebase CLI ya instalada y autenticada, para actualizar el destino autorizado:

```sh
npm run deploy
```

`npm run deploy` construye la imagen API con Docker local, la sube a Artifact Registry, actualiza el secreto desde Doppler, despliega Cloud Run y luego compila el sitio con la URL del API y publica Authentication + Hosting en `aula-c-jorge`. No usa Cloud Build ni crea llaves de cuenta de servicio. El despliegue puede generar cargos de GCP.

`npm run deploy -- --api-only` sigue el mismo recorrido de Docker/Artifact Registry/Cloud Run y termina al actualizar el API. Las pruebas de recuperación están en `scripts/document-analysis.test.mjs` y forman parte de `npm run quick`.

`npm run deploy -- --web-only` construye la web con la URL del servicio Cloud Run existente y publica Hosting/Auth. Las pruebas de adaptación de material, guía docente y catálogo están en `scripts/material-integration.test.mjs`.

## Fuentes educativas

Consulta de noviembre de 2026. Son orientación curricular, no equivalencias oficiales ni sílabos vigentes de todas las facultades:

- [PUCP, plan de Informática](https://facultad.pucp.edu.pe/generales-ciencias/wp-content/uploads/2022/08/plan-inform%C3%A1tica.pdf): progresión de Fundamentos de Programación a Técnicas de Programación. Los perfiles «Parcial» y «Anidados» provienen del material del repositorio, no se atribuyen como reglas generales de PUCP.
- [Sistemas UNI, material introductorio de C/C++](https://www.sistemasuni.edu.pe/templates/sistemasuni/nuevo/pdf/programacion/INTRODUCCI%C3%93N_Lenguaje%20Cc%20copia.pdf): referencia de extensión. No es evidencia de que toda carrera UNI empiece en C.
- [UNMSM, Estadística, plan 2023](https://matematicas.unmsm.edu.pe/img/about/PLAN%20DE%20ESTUDIOS%202023%20-%20FINAL.pdf): introducción a programación y aplicación posterior en métodos numéricos. No acredita un lenguaje concreto ni representa toda UNMSM.
- [WG14, borrador público C11 N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf): semántica de expresiones (§6.5), declaraciones (§6.7), E/S (§7.21) y memoria (§7.22.3). El selector por defecto compila como C17; esta referencia es un borrador C11, no el texto normativo C17.

Para alinear la ruta con una evaluación concreta hacen falta sus sílabos y enunciados autorizados. Incorporar material propio con autoría, semestre, curso, restricciones y permiso de uso; no publicar evaluaciones privadas automáticamente.
