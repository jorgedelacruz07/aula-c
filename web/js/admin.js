import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { apiBase, firebaseConfig } from "./firebase-config.js";

const ADMIN_EMAIL = "jdelacruzp7@gmail.com";
const $ = (selector) => document.querySelector(selector);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

let currentDocument = null;
let documents = [];

function status(element, message, kind = "") {
  element.textContent = message;
  element.dataset.kind = kind;
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

async function request(path, options = {}) {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof Blob) ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `La solicitud falló (${response.status}).`);
  return body;
}

function renderDocuments() {
  const list = $("#documents-list");
  if (!documents.length) {
    list.innerHTML = '<p class="empty">Aún no has subido documentos.</p>';
    return;
  }
  list.innerHTML = documents
    .map(
      (document) => `
    <button class="document-row" type="button" data-document="${escapeHtml(document.id)}" aria-current="${document.id === currentDocument?.id}">
      <span><strong>${escapeHtml(document.title)}</strong><small>${escapeHtml(document.course || "Sin curso indicado")} · ${new Date(document.createdAt).toLocaleDateString("es-PE")}</small></span>
      <span class="document-status">${escapeHtml({ uploading: "subiendo", uploaded: "subido", processing: "analizando", draft: "borrador", published: "publicado", quota: "cuota agotada", failed: "revisar error" }[document.status] || document.status || "subido")}</span>
    </button>`,
    )
    .join("");
  list.querySelectorAll("[data-document]").forEach((button) => {
    button.addEventListener("click", () => selectDocument(button.dataset.document));
  });
}

function renderDraft(draft) {
  $("#draft-json").value = draft ? JSON.stringify(draft, null, 2) : "";
  const summary = $("#draft-summary");
  if (!draft) {
    summary.textContent = "Este documento todavía no tiene un borrador didáctico.";
  } else {
    const sourcePages = [
      ...new Set(
        [...(draft.lessons || []), ...(draft.exercises || [])].flatMap((item) => item.sourcePages || []),
      ),
    ].sort((a, b) => a - b);
    summary.replaceChildren();
    const intro = document.createElement("p");
    intro.textContent = `${draft.documentTitle || "Documento"}: ${draft.topicSummary || "Sin resumen"}`;
    const counts = document.createElement("p");
    counts.textContent = `${draft.lessons?.length || 0} lecciones · ${draft.exercises?.length || 0} ejercicios · páginas citadas: ${sourcePages.length ? sourcePages.join(", ") : "revisar referencias"}`;
    summary.append(intro, counts);
    for (const lesson of (draft.lessons || []).slice(0, 4)) {
      const row = document.createElement("p");
      row.textContent = `Lección: ${lesson.title} · ${lesson.level} · ${lesson.topic}`;
      summary.append(row);
    }
    for (const exercise of (draft.exercises || []).slice(0, 4)) {
      const row = document.createElement("p");
      row.textContent = `Ejercicio: ${exercise.title} · ${exercise.everyday}`;
      summary.append(row);
    }
  }
  const enabled = Boolean(draft);
  $("#save-draft").disabled = !enabled;
  $("#publish-draft").disabled = !enabled;
  $("#delete-document").hidden = !currentDocument;
  $("#review-status").textContent = currentDocument?.status || "Sin borrador";
  $("#reanalyze-document").hidden =
    !currentDocument || !["uploaded", "failed", "quota"].includes(currentDocument.status);
}

async function refreshDocuments() {
  const result = await request("/admin/documents");
  documents = result.documents || [];
  renderDocuments();
}

async function selectDocument(id) {
  status($("#review-message"), "Cargando documento…");
  try {
    const result = await request(`/admin/documents/${encodeURIComponent(id)}`);
    currentDocument = result.document;
    renderDraft(result.draft);
    $("#review-title").textContent = currentDocument.title;
    renderDocuments();
    status(
      $("#review-message"),
      "Comprueba explicaciones, soluciones y correspondencia con las páginas originales.",
    );
  } catch (error) {
    status($("#review-message"), error.message, "error");
  }
}

async function prepareDocument(metadata) {
  status(
    $("#review-message"),
    "Gemini está leyendo el documento y preparando propuestas… Puede tardar un par de minutos.",
  );
  const result = await request(`/admin/documents/${metadata.id}/analyze`, { method: "POST", body: "{}" });
  currentDocument = result.document;
  renderDraft(result.draft);
  $("#review-title").textContent = currentDocument.title;
  await refreshDocuments();
  status($("#review-message"), "Borrador listo. Revísalo antes de publicar.", "success");
  $("#review-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#sign-in").addEventListener("click", async () => {
  status($("#auth-message"), "Abriendo Google…");
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, provider);
      return;
    }
    const message =
      error.code === "auth/operation-not-allowed"
        ? "El proveedor Google aún no está activado en Firebase Authentication."
        : error.code === "auth/popup-closed-by-user"
          ? "Se cerró la ventana de acceso. Puedes volver a intentarlo."
          : error.message;
    status($("#auth-message"), message, "error");
  }
});

$("#sign-out").addEventListener("click", () => signOut(auth));
$("#refresh-documents").addEventListener("click", () =>
  refreshDocuments().catch((error) => status($("#review-message"), error.message, "error")),
);

$("#reanalyze-document").addEventListener("click", async () => {
  if (!currentDocument) return;
  const button = $("#reanalyze-document");
  button.disabled = true;
  try {
    await prepareDocument(currentDocument);
  } catch (error) {
    status($("#review-message"), error.message, "error");
    await refreshDocuments().catch(() => {});
  } finally {
    button.disabled = false;
  }
});

$("#upload-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const file = form.get("file");
  const title = String(form.get("title") || "").trim();
  const button = event.currentTarget.querySelector("button[type=submit]");
  const extension = file instanceof File ? file.name.toLowerCase().slice(file.name.lastIndexOf(".")) : "";
  const contentType = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".md": "text/markdown",
  }[extension];
  if (!(file instanceof File) || !contentType) {
    status($("#upload-status"), "Selecciona un PDF, DOCX, TXT o Markdown (.md).", "error");
    return;
  }
  if (!file.size || file.size > 25 * 1024 * 1024) {
    status($("#upload-status"), "El PDF debe pesar como máximo 25 MB.", "error");
    return;
  }
  button.disabled = true;
  try {
    status($("#upload-status"), "Preparando una subida privada y temporal…");
    const id = crypto.randomUUID();
    await request(`/admin/documents/${id}/upload`, {
      method: "POST",
      body: JSON.stringify({
        title,
        fileName: file.name,
        contentType,
        size: file.size,
        course: form.get("course"),
        semester: form.get("semester"),
        level: form.get("level"),
      }),
    });
    await request(`/admin/documents/${id}/source`, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    status($("#upload-status"), "Documento privado recibido. Preparando el borrador…");
    await prepareDocument({ id, title });
    status($("#upload-status"), `“${title}” ya está listo para revisión.`, "success");
    event.currentTarget.reset();
  } catch (error) {
    status($("#upload-status"), error.message, "error");
    status($("#review-message"), error.message, "error");
    await refreshDocuments().catch(() => {});
  } finally {
    button.disabled = false;
  }
});

$("#save-draft").addEventListener("click", async () => {
  if (!currentDocument) return;
  try {
    const draft = JSON.parse($("#draft-json").value);
    const result = await request(`/admin/documents/${currentDocument.id}/draft`, {
      method: "PUT",
      body: JSON.stringify(draft),
    });
    currentDocument = result.document;
    renderDraft(result.draft);
    await refreshDocuments();
    status($("#review-message"), "Cambios guardados en el borrador privado.", "success");
  } catch (error) {
    status(
      $("#review-message"),
      error instanceof SyntaxError
        ? "El borrador no es JSON válido. Corrige la sintaxis y guarda otra vez."
        : error.message,
      "error",
    );
  }
});

$("#publish-draft").addEventListener("click", async () => {
  if (!currentDocument) return;
  try {
    const draft = JSON.parse($("#draft-json").value);
    await request(`/admin/documents/${currentDocument.id}/draft`, {
      method: "PUT",
      body: JSON.stringify(draft),
    });
    if (
      !window.confirm(
        "¿Ya verificaste la precisión, los ejemplos y las páginas citadas? El material aparecerá en el aula pública.",
      )
    )
      return;
    const result = await request(`/admin/documents/${currentDocument.id}/publish`, {
      method: "POST",
      body: JSON.stringify({ confirm: true }),
    });
    currentDocument = result.document;
    $("#review-status").textContent = currentDocument.status;
    await refreshDocuments();
    status($("#review-message"), "Material publicado en Aula C.", "success");
  } catch (error) {
    status(
      $("#review-message"),
      error instanceof SyntaxError ? "El borrador no es JSON válido." : error.message,
      "error",
    );
  }
});

$("#delete-document").addEventListener("click", async () => {
  if (
    !currentDocument ||
    !window.confirm(
      "Se borrarán el documento original, el borrador y cualquier publicación asociada. ¿Continuar?",
    )
  )
    return;
  try {
    await request(`/admin/documents/${currentDocument.id}`, { method: "DELETE" });
    currentDocument = null;
    $("#review-title").textContent = "Borrador docente";
    renderDraft(null);
    await refreshDocuments();
    status($("#review-message"), "Documento eliminado.", "success");
  } catch (error) {
    status($("#review-message"), error.message, "error");
  }
});

function syncThemeButton() {
  const current = document.documentElement.dataset.theme || "light";
  $("#theme-icon").textContent = current === "dark" ? "☀️" : "🌙";
  $("#theme-text").textContent = current === "dark" ? "Claro" : "Oscuro";
}

syncThemeButton();

$("#theme-toggle").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("aula-theme", next);
  syncThemeButton();
});

getRedirectResult(auth).catch((error) => {
  const message =
    error.code === "auth/operation-not-allowed"
      ? "El proveedor Google aún no está activado en Firebase Authentication."
      : error.message;
  status($("#auth-message"), message, "error");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    $("#auth-panel").hidden = false;
    $("#workspace").hidden = true;
    $("#sign-out").hidden = true;
    status($("#auth-message"), "Acceso protegido por Google.");
    currentDocument = null;
    return;
  }
  if (user.email?.toLowerCase() !== ADMIN_EMAIL || !user.emailVerified) {
    await signOut(auth);
    status($("#auth-message"), `Cuenta no autorizada. Usa ${ADMIN_EMAIL}.`, "error");
    return;
  }
  $("#auth-panel").hidden = true;
  $("#workspace").hidden = false;
  $("#sign-out").hidden = false;
  try {
    await refreshDocuments();
    status($("#review-message"), `Sesión iniciada como ${user.email}.`, "success");
  } catch (error) {
    status($("#review-message"), error.message, "error");
  }
});
