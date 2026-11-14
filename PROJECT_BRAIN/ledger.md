# Ledger · Aula C (antes C-Testing)

## 2026-11-14 · FIX · Biblioteca principal visible en administración local

- Solicitud: mostrar en `localhost:5183/admin` los documentos procesados por el asistente.
- Causa: separación de namespaces; producción usa la biblioteca principal y el API local usa `dev/`.
- Entrega: administración local con biblioteca principal por defecto vía proxy Vite autenticado y selector de pruebas temporales. Los originales permanecen en su espacio persistente; no se duplican ni se debilita el control por ID token.
- Evidencia: selección principal observada en navegador local, ruta proxy 401 sin sesión, ocho documentos verificados en GCS, `npm run quick` exit 0 con 21 pruebas y build. La ventana de prueba no tenía sesión del propietario para leer la lista autenticada.

## 2026-11-14 · DATA/FEATURE · Biblioteca de fundamentos y conexión con el aula

- Solicitud: usar los seis documentos nuevos para alimentar teoría, conocimientos, ejercicios y práctica de Aula C.
- Datos: seis fuentes privadas con 309 páginas, 17 lecciones, 22 ejercicios y 64 casos propuestos. Originales verificados por SHA-256; borradores leídos de vuelta desde GCS, con comentarios, referencias y guía docente completa. Se corrigieron explicaciones de precedencia, paso por valor y recurrencias. Los casos generados siguen pendientes de revisión semántica y ejecución.
- Integración `f4cc17a`: catálogo desde la URL de API en Hosting, adaptación al laboratorio con símbolos y guía docente propios, pruebas de integración y despliegue separado de web. Se mantuvieron los cambios previos de UI fuera del commit y del deploy.
- Generación `371ac32`: apertura, preguntas, errores, rúbrica y pizarra obligatorios por lección; recuperación automática si faltan. Nuevo inventario `docs/FUENTES-DOCENTES.md` enlazado desde README y plan docente.
- Producción: Hosting actualizado, API en `aula-c-docs-api-00007-vnr` al 100 %, min=0/max=1, CPU throttling; health 200. `npm run quick` pasó con 18 pruebas y build.
- Publicación: fuentes y borradores privados; cero recursos en el catálogo público. La aprobación desde `/admin` sigue siendo el paso para integrarlos en el aula pública.

## 2026-11-14 · FIX · Análisis de PDF extensos y recuperación de borradores

- Solicitud: corregir los fallos de formato de los PDF subidos a `/admin` y obtener teoría, explicaciones, código comentado y prácticas.
- Diagnóstico con el PDF real: Gemini devolvía `MAX_TOKENS` y JSON cortado; el PDF era válido. Los tokens de razonamiento agotaban el presupuesto de la respuesta.
- Entrega `177897d`: límite explícito de razonamiento, mayor espacio de salida, esquema acotado, un reintento compacto con plazo compartido, validación de campos internos y errores específicos; se mantiene el original y se limpia el error al recuperar el borrador.
- Evidencia: `npm run quick` pasó (13 pruebas), arranque Docker linux/amd64 pasó y ambas llamadas reales a Gemini terminaron `STOP`. Laboratorio 10: 3 lecciones/4 ejercicios; guía de ciclos anidados: 3 lecciones/3 ejercicios.
- Producción: deploy del API con `npm run deploy -- --api-only`, revisión `aula-c-docs-api-00006-n52` al 100 %, health 200 y admin anónimo 401. Ambos documentos quedan como borradores privados en GCS, sin publicación pública. El docente aún debe revisar la precisión, código y casos.
- Conservados los cambios de interfaz que ya estaban modificados al retomar la tarea; este commit y despliegue incluyen la corrección del API.

## 2026-11-13 · Aula C web

- Solicitud: guía teórico-práctica para aprender y enseñar C, ejecución web, comandos npm, integración Switchboard y documentación en ProjectsDocs/Vault.
- Implementación: 14 lecciones comentadas, editor y ejecución Clang/WASI en workers, 26 ejercicios originales y 52 fixtures, progreso local, guion docente, descarga/importación C, build estático y configuración Firebase Hosting.
- Fuentes técnicas: `docs/ARQUITECTURA.md`; alcance y aceptación: `docs/CONTRATO-WEB.md`; progresión: `docs/PLAN-DOCENTE.md`.
- Extensión explícita: el propietario pidió crear el proyecto Firebase. Creado `aula-c-jorge`, sin facturación vinculada, y publicado en https://aula-c-jorge.web.app. Comprobadas cabeceras COOP/COEP, ejecución C y E/S virtual en la URL pública. Sin commit ni push.
- Verificación final e integración: ver `handoff.md` al cierre.

- Cierre global: el ledger del meta-repo rechazó la escritura (`HOST_NOT_OWNER`: autoridad Air, sesión Mini). Registro preservado aquí; pendiente de reconciliación desde el host propietario. No se forzó el cambio.

## 2026-11-13 · Optimización UI/UX, Modo Docente, Dark Theme y Casos Cotidianos

- Solicitud: problemas de C con título y descripción visual basados en casos cotidianos (ej. sumatoria acumulada), optimización de espacios en blanco y paddings/margins, mejora de tamaños de texto, tema oscuro (Dark Theme), fortalecimiento del Modo Docente, rediseño de `/archivo.html` y actualización de `README.md`.
- Implementación:
  - Casos cotidianos: 14 lecciones y 26 ejercicios catalogados con títulos intuitivos, analogías de la vida real (caja registradora, cajero automático, sensores de luz, validación de PIN bancario, etc.) e íconos temáticos.
  - Modo Docente fortalecido: cockpit universitario para cátedra (PUCP, UNI, UNMSM) con preguntas socráticas, puntos ciegos de alumnos, rúbricas de evaluación y esquemas de trazabilidad en pizarra.
  - Dark Theme: soporte nativo y sincronizado de tema Claro/Oscuro con selector en la barra superior y persistencia en `localStorage`.
  - UI/UX compacta: optimización drástica de espacios en blanco, márgenes y paddings reducidos en workbench y secciones; tipografía accesible y legible.
  - Subpágina `/archivo.html`: rediseño completo integrado al sistema de tokens de Aula C con navegación superior, enlace de retorno, temas y visualizador de código y pruebas limpio.
  - Documentación: `README.md` actualizado con todas las nuevas capacidades.
- Verificación: `npm run quick` y `npm test` exit 0 (5/5 pruebas unitarias y de integración C pasadas; formato Prettier limpio).

### 2026-11-13 · NOTE · Legibilidad y renombre a Aula C

- **Resultado:** Textos de lectura/controles ≥14 px (verificado por estilos computados en 1440 px y 390 px, claro/oscuro, sin desbordamiento horizontal). Iconos decorativos repetidos retirados. Proyecto renombrado a Aula C en carpeta, GitHub, Xcode, registro, launcher (`aulac`), Switchboard, Vault, ProjectsDocs y T3. Gates: `npm run quick`, `make verify anidados test_anidados` y `npm run quick` del meta-repo en verde.

## 2026-11-14 · Administración privada de material docente

- **Solicitud:** aceptar PDFs y otros documentos como fuentes para la teoría y práctica, con inicio Google solo para `jdelacruzp7@gmail.com`, GCS y Gemini gratuito; publicar en Firebase y desplegar desde `npm run deploy`.
- **Implementación:** panel `/admin.html`; API Node en Cloud Run; GCS privado para fuentes y borradores; Gemini prepara teoría, código C comentado y ejercicios cotidianos con referencias al documento. Publicación requiere revisión y acción explícita del docente. Tipos admitidos: PDF, DOCX, TXT y Markdown. Se rechazan peticiones privadas sin ID token válido del correo permitido.
- **Infraestructura:** proyecto facturable `aula-c-knowledge-jorge`; bucket `aula-c-knowledge-jorge-774195700936`; Secret Manager, Artifact Registry y Cloud Run. Gemini API usa el proyecto gratuito no facturado `gen-lang-client-0329030513`; el propietario aceptó el procesamiento de datos bajo sus condiciones. La infraestructura puede generar costos aunque Cloud Run escale a cero.
- **Seguridad y retención:** no se guardan llaves de service account; ADC usa impersonación aislada para desarrollo. Los objetos `dev/` caducan a los 7 días; fuente y borrador no se exponen públicamente.
- **Deploy verificado:** 2026-11-14, Hosting `aula-c-jorge` y Cloud Run `aula-c-docs-api`. Health 200 con configuración GCS y clave Gemini presentes; API administrativa anónima devuelve 401; aún no hay documentos/material publicados ni se ha hecho una generación real de Gemini. Revisión activa `aula-c-docs-api-00003-p57` al 100 %; máximo efectivo a nivel servicio 1, aunque la anotación de plantilla conserva el default 20.
- **Corrección de carga:** el frontend ahora envía el tipo MIME del archivo seleccionado (PDF/DOCX/TXT/Markdown), requisito del endpoint autenticado de subida. Se confirmó la versión compilada desplegada en Hosting.
- **Comandos e integración:** `npm run dev` inicia web :5183 y API :5184; Switchboard `aulac` ya muestra ambos. `npm run dev:auth` configura ADC aisladas con navegador. Actualizados ProjectsDocs, la ficha Vault, el catálogo de workspace, scripts/túneles y la documentación de máquinas. Proyección privada de ProjectsDocs pasó build/auditoría con aviso de 93 enlaces no resueltos. Implementación enviada a `master` en `76c33db`.
- **Verificación realizada:** formato Prettier, sintaxis Node, build Vite, health, catálogo vacío, admin anónimo 401, asset desplegado con MIME dinámico y configuración activa de Cloud Run. No se ejecutó `npm run quick` ni la suite de pruebas.
