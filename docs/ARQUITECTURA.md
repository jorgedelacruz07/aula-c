# Aula C: arquitectura y publicación

## Ejecución

La web es estática: Vite empaqueta HTML, CSS y JavaScript. `@runno/wasi` 0.10.0 ofrece un host WASI en workers del navegador. Clang 8 compila un único archivo C a un objeto WebAssembly, wasm-ld enlaza libc/libm y otro worker ejecuta el binario. No hay API que ejecute C nativo, procesos del alumno, base de datos ni credenciales.

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

Vite aplica las mismas cabeceras en local. Firebase Functions, Cloud Run y Firebase App Hosting no son necesarios. El propietario autorizó crear el proyecto. Se creó `aula-c-jorge` y se publicó <https://aula-c-jorge.web.app> el 2026-11-13. El proyecto no tiene cuenta de facturación vinculada (`gcloud billing projects describe`: `billingEnabled=false`, `billingAccountName` vacío). La URL pública se verificó compilando y ejecutando el primer programa y el ejemplo de archivos, con aislamiento de origen activo. No se crearon Functions, Cloud Run, App Hosting ni bases de datos.

Para futuras publicaciones: conservar el destino exclusivo y verificar las cuotas de almacenamiento y transferencia en [la documentación de cuotas de Hosting](https://firebase.google.com/docs/hosting/usage-quotas-pricing). El tamaño del compilador hace especialmente relevante la transferencia; estático no significa ilimitado ni garantiza coste cero. Mantener el plan sin facturación mientras se evalúa el uso. No habilitar Blaze ni servicios facturables automáticamente.

Con Firebase CLI ya instalada y autenticada, para actualizar el destino autorizado:

```sh
npm run deploy
```

El script publica por defecto en `aula-c-jorge` (otro proyecto existente: `FIREBASE_PROJECT=<id> npm run deploy`), construye localmente y llama a `firebase deploy --only hosting --project <id>`. No inventa una `.firebaserc`, no modifica el proyecto por defecto de otros repos y no crea recursos de cómputo. Publica sobre el sitio Hosting predeterminado del proyecto indicado: no apuntarlo a un sitio de otro producto sin una decisión explícita.

## Fuentes educativas

Consulta de noviembre de 2026. Son orientación curricular, no equivalencias oficiales ni sílabos vigentes de todas las facultades:

- [PUCP, plan de Informática](https://facultad.pucp.edu.pe/generales-ciencias/wp-content/uploads/2022/08/plan-inform%C3%A1tica.pdf): progresión de Fundamentos de Programación a Técnicas de Programación. Los perfiles «Parcial» y «Anidados» provienen del material del repositorio, no se atribuyen como reglas generales de PUCP.
- [Sistemas UNI, material introductorio de C/C++](https://www.sistemasuni.edu.pe/templates/sistemasuni/nuevo/pdf/programacion/INTRODUCCI%C3%93N_Lenguaje%20Cc%20copia.pdf): referencia de extensión. No es evidencia de que toda carrera UNI empiece en C.
- [UNMSM, Estadística, plan 2023](https://matematicas.unmsm.edu.pe/img/about/PLAN%20DE%20ESTUDIOS%202023%20-%20FINAL.pdf): introducción a programación y aplicación posterior en métodos numéricos. No acredita un lenguaje concreto ni representa toda UNMSM.
- [WG14, borrador público C11 N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf): semántica de expresiones (§6.5), declaraciones (§6.7), E/S (§7.21) y memoria (§7.22.3). El selector por defecto compila como C17; esta referencia es un borrador C11, no el texto normativo C17.

Para alinear la ruta con una evaluación concreta hacen falta sus sílabos y enunciados autorizados. Incorporar material propio con autoría, semestre, curso, restricciones y permiso de uso; no publicar evaluaciones privadas automáticamente.
