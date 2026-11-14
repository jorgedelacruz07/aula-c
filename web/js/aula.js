import { lessons } from "./curriculum.js";
import { symbols, passes, escapeHtml as esc } from "./learning.js";
import { CRunner } from "./runner.js";
import { apiBase } from "./firebase-config.js";
import { materialLabItem, fetchPublishedMaterials } from "./materials.js";

const $ = (selector) => document.querySelector(selector);
const runner = new CRunner();
const storageKey = "aula-c:v2";
let saved;
try {
  saved = JSON.parse(localStorage.getItem(storageKey));
} catch {
  /* Navegación privada */
}
const state = { drafts: {}, checked: {}, ...saved };
if (!state.drafts || typeof state.drafts !== "object") state.drafts = {};
if (!state.checked || typeof state.checked !== "object") state.checked = {};

let selected = null,
  original = "",
  catalog = [],
  loadVersion = 0,
  actionVersion = 0;

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    $("#execution-status").textContent = "No se pudo guardar el borrador en este navegador.";
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("aula-theme", theme);
  } catch {}
  const isDark = theme === "dark";
  const icon = $("#theme-icon");
  const text = $("#theme-text");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (text) text.textContent = isDark ? "Claro" : "Oscuro";
}

const savedTheme = localStorage.getItem("aula-theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
applyTheme(initialTheme);

if ($("#theme-toggle")) {
  $("#theme-toggle").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  };
}

function updateProgress() {
  const count = lessons.filter((item) => typeof state.checked[item.path] === "string").length;
  $("#progress").textContent = `${count} de ${lessons.length} casos verificados`;
  const pct = lessons.length ? Math.round((count / lessons.length) * 100) : 0;
  if ($("#lesson-progress-text")) {
    $("#lesson-progress-text").textContent = `${count} de ${lessons.length} verificadas (${pct}%)`;
  }
  if ($("#lesson-progress-fill")) {
    $("#lesson-progress-fill").style.width = `${pct}%`;
  }
}

// Keep the active lesson visible inside the rail without scrolling the page itself.
function revealActiveLesson(list) {
  const active = list.querySelector(".lesson-button.active");
  if (!active) return;
  const horizontal = list.scrollWidth > list.clientWidth + 1 && list.scrollHeight <= list.clientHeight + 1;
  const listBox = list.getBoundingClientRect();
  const box = active.getBoundingClientRect();
  if (horizontal) {
    if (box.left < listBox.left || box.right > listBox.right) list.scrollLeft += box.left - listBox.left - 4;
    return;
  }
  const headerOffset = 40;
  if (box.top < listBox.top + headerOffset) list.scrollTop += box.top - listBox.top - headerOffset;
  else if (box.bottom > listBox.bottom - 12) list.scrollTop += box.bottom - listBox.bottom + 28;
}

function updateLessonListFades(list = $("#lesson-list")) {
  if (!list) return;
  list.classList.toggle("can-scroll-up", list.scrollTop > 2);
  list.classList.toggle("can-scroll-down", list.scrollTop + list.clientHeight < list.scrollHeight - 2);
}

function renderLessons() {
  const query = ($("#search")?.value || "").toLocaleLowerCase("es");
  const levelVal = $("#level")?.value || "all";
  const topicVal = $("#topic")?.value || "all";

  if ($("#count-lesson-all")) $("#count-lesson-all").textContent = lessons.length;
  if ($("#count-lesson-basico"))
    $("#count-lesson-basico").textContent = lessons.filter((l) => l.level === "Básico").length;
  if ($("#count-lesson-intermedio"))
    $("#count-lesson-intermedio").textContent = lessons.filter((l) => l.level === "Intermedio").length;
  if ($("#count-lesson-avanzado"))
    $("#count-lesson-avanzado").textContent = lessons.filter((l) => l.level === "Avanzado").length;

  document.querySelectorAll("[data-lesson-level-tab]").forEach((tab) => {
    const active = tab.dataset.lessonLevelTab === levelVal;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  const visible = lessons.filter(
    (item) =>
      (levelVal === "all" || item.level === levelVal) &&
      (topicVal === "all" || item.topic === topicVal) &&
      `${item.title} ${item.topic} ${item.concept} ${item.everyday || ""}`
        .toLocaleLowerCase("es")
        .includes(query),
  );

  $("#lesson-count").textContent =
    visible.length === lessons.length ? `${visible.length}` : `${visible.length}/${lessons.length}`;
  const totalMinutes = visible.reduce((sum, item) => sum + (item.minutes || 0), 0);
  if ($("#lesson-total-minutes")) {
    $("#lesson-total-minutes").textContent = `${totalMinutes} min en vista`;
  }

  const externalBanner = $("#active-external-item");
  if (externalBanner) {
    const isExternalSelected = selected && !lessons.some((l) => l.id === selected.id);
    if (isExternalSelected) {
      externalBanner.hidden = false;
      externalBanner.innerHTML = `
        <div class="external-banner-top">
          <span class="external-badge">${esc(selected.stage || "Catálogo")} · ${esc(selected.level || "")}</span>
          <span class="external-active-dot">Activo</span>
        </div>
        <strong>${esc(selected.title)}</strong>
        <small>${esc((selected.path || "").split("/").pop())}</small>
      `;
    } else {
      externalBanner.hidden = true;
      externalBanner.innerHTML = "";
    }
  }

  const levelsOrder = ["Básico", "Intermedio", "Avanzado"];
  const groupedHtml = visible.length
    ? levelsOrder
        .map((lvl) => {
          const groupItems = visible.filter((item) => item.level === lvl);
          if (!groupItems.length) return "";
          const doneInGroup = groupItems.filter(
            (item) => typeof state.checked[item.path] === "string",
          ).length;
          const levelSlug = lvl
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          const itemsHtml = groupItems
            .map((item) => {
              const isSelected = selected?.id === item.id;
              const isChecked = Boolean(state.checked[item.path]);
              const hasDraft = Boolean(state.drafts[item.path]) && !isChecked;
              const stepNum = item.id.slice(0, 2);
              return `<button type="button" class="lesson-button ${isSelected ? "active" : ""} ${isChecked ? "verified" : ""}" data-lesson="${item.id}" aria-pressed="${isSelected}">
                <span class="lesson-step-badge ${isChecked ? "done" : ""}">${isChecked ? "✓" : stepNum}</span>
                <div class="lesson-button-body">
                  <div class="lesson-button-title">${esc(item.title)}</div>
                  <small class="lesson-button-meta">
                    <span class="lesson-topic-pill">${esc(item.topic)}</span>
                    <span class="lesson-meta-sep">·</span>
                    <span>${item.minutes} min</span>
                    ${
                      isChecked
                        ? '<span class="lesson-status-tag verified">Verificada</span>'
                        : hasDraft
                          ? '<span class="lesson-status-tag draft">Borrador</span>'
                          : ""
                    }
                  </small>
                </div>
              </button>`;
            })
            .join("");

          return `<div class="lesson-group">
            <div class="lesson-group-header">
              <span class="lesson-group-badge level-${levelSlug}">${esc(lvl)}</span>
              <span class="lesson-group-count">${doneInGroup}/${groupItems.length}</span>
            </div>
            <div class="lesson-group-items">${itemsHtml}</div>
          </div>`;
        })
        .join("")
    : `<div class="lesson-empty-state">
        <p class="empty">No hay lecciones con estos filtros.</p>
        <button type="button" class="secondary reset-lessons-btn" id="reset-lesson-filters">Ver las 14 lecciones</button>
      </div>`;

  const list = $("#lesson-list");
  const previousScroll = list.scrollTop;
  list.innerHTML = groupedHtml;
  list.scrollTop = previousScroll;
  revealActiveLesson(list);
  updateLessonListFades(list);

  const resetLessonsBtn = $("#reset-lesson-filters");
  if (resetLessonsBtn) {
    resetLessonsBtn.onclick = () => {
      $("#level").value = "all";
      $("#topic").value = "all";
      $("#search").value = "";
      renderLessons();
    };
  }

  document
    .querySelectorAll("[data-lesson]")
    .forEach(
      (button) => (button.onclick = () => load(lessons.find((item) => item.id === button.dataset.lesson))),
    );
}

function explain(symbol) {
  $("#symbol-explanation").textContent = selected?.symbolExplanations?.[symbol] || symbols[symbol] || "";
  document
    .querySelectorAll("[data-symbol]")
    .forEach((button) => button.classList.toggle("active", button.dataset.symbol === symbol));
}

function theory(item) {
  const isLesson = !!item.concept;
  const teacherActive = $("#teacher-mode").checked;
  const lessonIndex = lessons.findIndex((l) => l.id === item.id);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 && lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const isVerified = Boolean(state.checked[item.path]);
  const levelSlug = (item.level || "Básico")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  $("#lesson-content").innerHTML = `
    <div class="lesson-header-bar">
      <div class="lesson-meta">
        ${lessonIndex >= 0 ? `<span class="lesson-step-chip">LECCIÓN ${String(lessonIndex + 1).padStart(2, "0")} DE ${lessons.length}</span>` : `<span class="lesson-step-chip">EJERCICIO DE CATÁLOGO</span>`}
        <span class="badge-level level-${esc(levelSlug)}">${esc(item.level)}</span>
        <span class="lesson-meta-topic">${esc(item.topic || (item.stage === "Anidados" ? "Ciclos anidados" : "Algoritmos numéricos"))}</span>
        <span class="lesson-meta-duration">${isLesson ? `⏱ ${item.minutes} min` : `Perfil ${esc(item.stage)}`}</span>
        ${isVerified ? `<span class="lesson-verified-pill">✓ Caso verificado</span>` : ""}
      </div>
      ${
        lessonIndex >= 0
          ? `<div class="lesson-stepper">
              <button type="button" class="stepper-btn" id="prev-lesson-btn" ${prevLesson ? "" : "disabled"} title="${prevLesson ? esc(prevLesson.title) : "Primera lección"}">← Anterior</button>
              <button type="button" class="stepper-btn" id="next-lesson-btn" ${nextLesson ? "" : "disabled"} title="${nextLesson ? esc(nextLesson.title) : "Última lección"}">Siguiente →</button>
            </div>`
          : `<div class="lesson-stepper">
              <button type="button" class="stepper-btn" id="back-to-lessons-btn">← Volver a lecciones</button>
            </div>`
      }
    </div>
    <h3>${esc(item.title)}</h3>
    ${item.everyday ? `<p class="everyday-hint">${esc(item.everyday)}</p>` : ""}
    <p class="lesson-concept">${esc(item.concept || "Lee el encabezado y los contratos de las funciones. Predice la salida, selecciona un caso disponible y compara tu razonamiento con la ejecución.")}</p>
    <div class="explanation">
      <b>EL PORQUÉ</b>
      ${esc(item.why || "Este programa se carga desde su archivo original. Las restricciones de su perfil pertenecen al material de práctica: C general también permite arreglos, estructuras y otros ciclos. El compilador C89 comprueba sintaxis de ese estándar, no las reglas académicas particulares.")}
    </div>
    <div class="symbols-panel">
      <span class="symbols-caption">SÍMBOLOS CLAVE DE LA LECCIÓN (haz clic para inspeccionar):</span>
      <div class="symbols">
        ${(item.symbols || ["&", "*", "%d", "while", "return"])
          .map(
            (symbol) =>
              `<button type="button" class="symbol" data-symbol="${esc(symbol)}">${esc(symbol)}</button>`,
          )
          .join("")}
      </div>
      <p id="symbol-explanation" aria-live="polite"></p>
    </div>
    <div class="concept-accordions">
      <details class="concept-details">
        <summary>⚠️ Un error que vale la pena entender</summary>
        <p>${esc(item.trap || "Valida las conversiones de scanf, los divisores y los límites antes de operar. Que un programa compile no garantiza que su resultado sea correcto.")}</p>
      </details>
      <details class="concept-details">
        <summary>🚀 Ahora te toca: modifica y explica</summary>
        <p>${esc(item.challenge || "Añade un caso límite, justifica su salida y explica la responsabilidad de cada función. Los casos guardados no cubren necesariamente todo el dominio.")}</p>
      </details>
    </div>
    <div class="teacher-content" ${teacherActive ? "" : "hidden"}>
      <b>PARA TU SIGUIENTE CLASE · MODO DOCENTE (PUCP / UNI / UNMSM)</b>
      <p>${esc(item.teacher || "Dibuja el flujo entre módulos. Pide al alumno elegir una variable y describir su tipo, propósito, rango y duración; después solicita una prueba que pueda refutar su solución.")}</p>
      ${
        item.teacherDetails
          ? `
      <div class="teacher-sections">
        <div>
          <h4>Preguntas socráticas</h4>
          <ul>${item.teacherDetails.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
        </div>
        <div>
          <h4>Puntos ciegos de alumnos</h4>
          <ul>${item.teacherDetails.blindspots.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>
        <div>
          <h4>Rúbrica de evaluación</h4>
          <ul>${item.teacherDetails.rubric.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        </div>
      </div>
      ${item.teacherDetails.blackboard ? `<p class="teacher-blackboard"><b>Pizarra:</b> ${esc(item.teacherDetails.blackboard)}</p>` : ""}
      `
          : ""
      }
    </div>
  `;

  if ($("#prev-lesson-btn") && prevLesson) {
    $("#prev-lesson-btn").onclick = () => load(prevLesson);
  }
  if ($("#next-lesson-btn") && nextLesson) {
    $("#next-lesson-btn").onclick = () => load(nextLesson);
  }
  if ($("#back-to-lessons-btn")) {
    $("#back-to-lessons-btn").onclick = () => load(lessons[0]);
  }

  document
    .querySelectorAll("[data-symbol]")
    .forEach((button) => (button.onclick = () => explain(button.dataset.symbol)));
  explain((item.symbols || ["&"])[0]);
}

function busy(value) {
  for (const id of ["run", "verify", "reset", "import", "standard", "test-case"])
    $(`#${id}`).disabled = value;
  $("#verify").disabled = value || !selected?.tests?.length;
  $("#stop").disabled = !value;
  $("#source").readOnly = value;
  $("#stdin").readOnly = value;
}

async function load(item) {
  runner.cancel();
  actionVersion++;
  const version = ++loadVersion;
  selected = item;
  original = "";
  $("#source").value = "";
  $("#filename").textContent = item.path.split("/").pop();
  $("#test-results").replaceChildren();
  $("#output").textContent = "Cargando código…";
  $("#output").className = "";
  theory(item);
  renderLessons();
  renderExercises();
  busy(true);
  try {
    let source = item.sourceC;
    if (typeof source !== "string") {
      const response = await fetch("/" + item.path);
      if (!response.ok) throw new Error("No se pudo cargar el archivo C.");
      source = await response.text();
    }
    if (version !== loadVersion) return;
    original = source;
    $("#source").value = state.drafts[item.path] ?? source;
    $("#test-case").innerHTML = item.tests?.length
      ? item.tests.map((test, i) => `<option value="${i}">${esc(test.name)}</option>`).join("")
      : "<option>Sin casos guardados</option>";
    $("#stdin").value = item.tests?.[0]?.input || "";
    $("#output").textContent = "Predice la salida. Luego ejecuta o verifica los casos de referencia.";
    $("#execution-status").textContent =
      state.checked[item.path] === $("#source").value
        ? "Casos verificados para este código"
        : "Listo para compilar";
    state.last = item.id;
    persist();
    history.replaceState(null, "", `?leccion=${encodeURIComponent(item.id)}${location.hash}`);
  } catch (error) {
    if (version === loadVersion) $("#output").textContent = error.message;
  } finally {
    if (version === loadVersion) {
      busy(false);
      if (!original) {
        $("#run").disabled = true;
        $("#verify").disabled = true;
      }
    }
  }
}

function recordDraft() {
  if (!selected) return;
  state.drafts[selected.path] = $("#source").value;
  if (state.checked[selected.path] && state.checked[selected.path] !== $("#source").value)
    delete state.checked[selected.path];
  persist();
  updateProgress();
  renderLessons();
  renderExercises();
}

async function execute(verify = false) {
  if (!selected || runner.active || !original) return;
  const version = ++actionVersion;
  const item = selected,
    code = $("#source").value;
  const standard = $("#standard").value;
  busy(true);
  $("#output").className = "";
  $("#output").textContent = "";
  $("#test-results").replaceChildren();
  const onStatus = (status) => {
    if (version === actionVersion) $("#execution-status").textContent = status;
  };
  try {
    if (verify) {
      let allPassed = true;
      for (const [i, test] of item.tests.entries()) {
        const result = await runner.run(code, test.input, { standard, onStatus });
        if (version !== actionVersion) return;
        const ok = passes(result, test);
        allPassed = allPassed && ok;
        const row = document.createElement("div");
        row.className = `test-result ${ok ? "" : "fail"}`;
        row.innerHTML = `${ok ? "✓" : "✗"} ${i + 1}. ${esc(test.name)}${ok ? "" : `<pre>Esperado (salida ${test.exitCode ?? 0}):\n${esc(test.output)}\nObtenido (salida ${result.exitCode} · ${esc(result.phase)}):\n${esc(result.stdout)}\n${esc(result.stderr)}</pre>`}`;
        $("#test-results").append(row);
        $("#output").textContent = result.stdout + result.stderr;
      }
      $("#execution-status").textContent = allPassed
        ? `${item.tests.length} caso(s) verificado(s). Explica por qué funciona.`
        : "Hay diferencias: revisa los resultados.";
      if (allPassed && $("#source").value === code) state.checked[item.path] = code;
      else delete state.checked[item.path];
      persist();
      updateProgress();
      renderLessons();
      renderExercises();
    } else {
      const result = await runner.run(code, $("#stdin").value, { standard, onStatus });
      if (version !== actionVersion) return;
      $("#output").textContent = result.stdout + result.stderr || "(Sin salida en consola)";
      $("#output").classList.toggle("error", result.exitCode !== 0);
      $("#execution-status").textContent = `${result.phase} · código de salida ${result.exitCode}`;
    }
  } catch (error) {
    if (version === actionVersion) {
      $("#output").textContent = error.message;
      $("#output").className = "error";
      $("#execution-status").textContent = "Ejecución interrumpida";
    }
  } finally {
    if (version === actionVersion) busy(false);
  }
}

function renderExercises() {
  if (!catalog.length) return;
  const query = ($("#exercise-search")?.value || "").toLocaleLowerCase("es");
  const stageVal = $("#exercise-stage")?.value || "all";
  const levelVal = $("#exercise-level")?.value || "all";
  const coverageVal = $("#exercise-coverage")?.value || "all";

  const parcialCount = catalog.filter((item) => item.stage === "Parcial").length;
  const anidadosCount = catalog.filter((item) => item.stage === "Anidados").length;
  if ($("#count-stage-all")) $("#count-stage-all").textContent = catalog.length;
  if ($("#count-stage-parcial")) $("#count-stage-parcial").textContent = parcialCount;
  if ($("#count-stage-anidados")) $("#count-stage-anidados").textContent = anidadosCount;

  document.querySelectorAll("[data-stage-tab]").forEach((tab) => {
    const active = tab.dataset.stageTab === stageVal;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  const visible = catalog.filter((item) => {
    const matchStage = stageVal === "all" || item.stage === stageVal;
    const matchLevel = levelVal === "all" || item.level === levelVal;
    const hasTests = Boolean(item.tests?.length);
    const matchCoverage = coverageVal === "all" || (coverageVal === "tested" ? hasTests : !hasTests);
    const matchQuery = `${item.title} ${item.id} ${item.topic} ${item.everyday || ""} ${item.path || ""}`
      .toLocaleLowerCase("es")
      .includes(query);
    return matchStage && matchLevel && matchCoverage && matchQuery;
  });

  const totalTests = visible.reduce((sum, item) => sum + (item.tests?.length || 0), 0);
  const engagedCount = catalog.filter(
    (item) => typeof state.checked[item.path] === "string" || typeof state.drafts[item.path] === "string",
  ).length;

  if ($("#stat-visible-exercises")) $("#stat-visible-exercises").textContent = visible.length;
  if ($("#stat-total-tests")) $("#stat-total-tests").textContent = totalTests;
  if ($("#stat-verified-exercises")) $("#stat-verified-exercises").textContent = engagedCount;
  $("#exercise-count").textContent =
    visible.length === catalog.length
      ? `de ${catalog.length} ejercicios`
      : `de ${catalog.length} ejercicios filtrados`;

  $("#exercise-list").innerHTML =
    visible
      .map((item, i) => {
        const isSelected = selected?.path === item.path;
        const isVerified = typeof state.checked[item.path] === "string";
        const hasDraft = typeof state.drafts[item.path] === "string";
        const fileName = (item.path || "").split("/").pop();
        const testCount = item.tests?.length || 0;
        const levelSlug = (item.level || "Básico")
          .toLocaleLowerCase("es")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        return `<button type="button" class="exercise-card ${isSelected ? "active" : ""} ${isVerified ? "verified" : ""}" data-exercise="${i}" aria-pressed="${isSelected}">
          <div class="exercise-card-top">
            <span class="exercise-icon" aria-hidden="true">${esc(item.icon || "📄")}</span>
            <div class="exercise-badges">
              <span class="badge-stage">${esc(item.stage)}</span>
              <span class="badge-level level-${esc(levelSlug)}">${esc(item.level)}</span>
            </div>
            <span class="exercise-code-id">${esc(item.id.toUpperCase())}</span>
          </div>
          <div class="exercise-card-body">
            <h3>${esc(item.title)}</h3>
            ${item.everyday ? `<p class="exercise-everyday-text">${esc(item.everyday)}</p>` : ""}
          </div>
          <div class="exercise-card-meta">
            <span class="exercise-topic-tag">${esc(item.topic || "Algoritmos en C")}</span>
            <code class="exercise-filename">${esc(fileName)}</code>
          </div>
          <div class="exercise-card-footer">
            <span class="exercise-test-pill ${testCount ? "has-tests" : "free-mode"}">
              <span class="pill-dot"></span>
              ${
                isVerified
                  ? `Verificado (${testCount} ${testCount === 1 ? "caso" : "casos"}) ✓`
                  : testCount
                    ? `${testCount} ${testCount === 1 ? "caso de prueba" : "casos disponibles"}`
                    : hasDraft
                      ? "Borrador guardado · libre"
                      : "Exploración libre"
              }
            </span>
            <span class="exercise-cta">${isSelected ? "En laboratorio ●" : "Abrir en lab →"}</span>
          </div>
        </button>`;
      })
      .join("") ||
    `<div class="empty-catalog-state">
      <p class="empty">No encontramos ejercicios con esos criterios de búsqueda.</p>
      <button type="button" class="secondary reset-filters-btn" id="reset-exercise-filters">Restablecer filtros</button>
    </div>`;

  const resetBtn = $("#reset-exercise-filters");
  if (resetBtn) {
    resetBtn.onclick = () => {
      $("#exercise-stage").value = "all";
      $("#exercise-level").value = "all";
      if ($("#exercise-coverage")) $("#exercise-coverage").value = "all";
      $("#exercise-search").value = "";
      renderExercises();
    };
  }

  document.querySelectorAll("[data-exercise]").forEach(
    (button) =>
      (button.onclick = () => {
        load(visible[Number(button.dataset.exercise)]);
        $("#laboratorio").scrollIntoView({ behavior: "smooth" });
      }),
  );
}

for (const topic of new Set(lessons.map((item) => item.topic))) $("#topic").add(new Option(topic, topic));
for (const id of ["level", "topic", "search"]) $(`#${id}`).addEventListener("input", renderLessons);
$("#lesson-list").addEventListener("scroll", () => updateLessonListFades(), { passive: true });
window.addEventListener("resize", () => updateLessonListFades(), { passive: true });
window.matchMedia("(max-width: 820px)").addEventListener("change", () => {
  revealActiveLesson($("#lesson-list"));
  updateLessonListFades();
});
document.querySelectorAll("[data-lesson-level-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    $("#level").value = button.dataset.lessonLevelTab;
    renderLessons();
  });
});
for (const id of ["exercise-stage", "exercise-level", "exercise-coverage", "exercise-search"]) {
  if ($(`#${id}`)) $(`#${id}`).addEventListener("input", renderExercises);
}
document.querySelectorAll("[data-stage-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    $("#exercise-stage").value = button.dataset.stageTab;
    renderExercises();
  });
});
if ($("#library-import")) {
  $("#library-import").onclick = () => $("#file-input").click();
}

document.querySelectorAll("[data-level]").forEach(
  (button) =>
    (button.onclick = () => {
      $("#level").value = button.dataset.level;
      $("#topic").value = "all";
      $("#search").value = "";
      renderLessons();
      load(lessons.find((item) => item.level === button.dataset.level));
      $("#laboratorio").scrollIntoView({ behavior: "smooth" });
    }),
);

$("#teacher-mode").checked = state.teacher === true;
$("#teacher-mode").onchange = () => {
  state.teacher = $("#teacher-mode").checked;
  persist();
  if (selected) theory(selected);
};

$("#run").onclick = () => execute();
$("#verify").onclick = () => execute(true);
$("#stop").onclick = () => runner.cancel();
$("#source").addEventListener("input", recordDraft);
$("#source").addEventListener("keydown", (event) => {
  if (event.target.readOnly) return;
  if (event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();
    const start = event.target.selectionStart,
      end = event.target.selectionEnd;
    event.target.setRangeText("    ", start, end, "end");
    recordDraft();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    execute();
  }
});

$("#reset").onclick = () => {
  $("#source").value = original;
  recordDraft();
  $("#execution-status").textContent = "Ejemplo restaurado";
};

$("#test-case").onchange = () => {
  $("#stdin").value = selected.tests[Number($("#test-case").value)]?.input || "";
};

$("#download").onclick = () => {
  const url = URL.createObjectURL(new Blob([$("#source").value], { type: "text/x-c" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = $("#filename").textContent;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

$("#import").onclick = () => $("#file-input").click();
$("#file-input").onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 65536 || !file.name.toLowerCase().endsWith(".c")) {
    $("#output").textContent = "Elige un archivo .c de hasta 64 KiB.";
    event.target.value = "";
    return;
  }
  runner.cancel();
  const version = ++loadVersion;
  ++actionVersion;
  busy(true);
  $("#execution-status").textContent = "Leyendo archivo local…";
  try {
    const source = await file.text();
    if (version !== loadVersion) return;
    selected = {
      id: "local",
      path: "local/" + file.name,
      title: file.name,
      topic: "Material propio",
      level: "Personal",
      tests: [],
      stage: "Personal",
      everyday: "Archivo C personalizado importado.",
    };
    original = source;
    $("#source").value = original;
    $("#filename").textContent = file.name;
    $("#stdin").value = "";
    $("#test-case").innerHTML = "<option>Exploración libre</option>";
    $("#test-results").replaceChildren();
    theory(selected);
    renderLessons();
    $("#execution-status").textContent = "Archivo local. No se ha subido a ningún servidor.";
    $("#output").textContent =
      "Puedes editar, ejecutar y descargar tu archivo. No tiene casos de referencia guardados.";
    history.replaceState(null, "", location.pathname + location.hash);
  } catch (error) {
    if (version === loadVersion) {
      $("#output").textContent = "No se pudo leer el archivo: " + error.message;
      $("#execution-status").textContent = "Error de lectura";
    }
  } finally {
    if (version === loadVersion) busy(false);
    event.target.value = "";
  }
};

window.addEventListener("beforeunload", () => runner.cancel());
updateProgress();

try {
  const response = await fetch("/catalog.json");
  if (!response.ok) throw new Error("Catálogo no disponible.");
  catalog = await response.json();
  renderExercises();
} catch {
  $("#exercise-count").textContent = "Catálogo no disponible";
  $("#exercise-list").textContent = "Ejecuta npm run prepare:content y recarga.";
}

const requested = new URLSearchParams(location.search).get("leccion") || state.last;
await load(
  lessons.find((item) => item.id === requested) ||
    catalog.find((item) => item.id === requested) ||
    lessons[0],
);

function sourceLabel(pages, sections) {
  const citations = [];
  if (pages?.length) citations.push(`págs. ${pages.join(", ")}`);
  if (sections?.length) citations.push(`secciones: ${sections.join(" · ")}`);
  return citations.length
    ? `Referencia: ${citations.join("; ")}`
    : "Referencia de origen pendiente de confirmar";
}

async function renderPublishedMaterials() {
  const container = $("#published-materials");
  try {
    const materials = await fetchPublishedMaterials(apiBase);
    $("#published-count").textContent =
      `${materials.length} ${materials.length === 1 ? "material aprobado" : "materiales aprobados"}`;
    if (!materials.length) {
      container.innerHTML =
        '<p class="empty">Todavía no hay documentos aprobados. Cuando un docente publique material revisado, sus explicaciones y ejercicios aparecerán aquí.</p>';
      return;
    }
    container.innerHTML = materials
      .map(
        (material) => `
      <article class="published-card">
        <div class="published-heading"><div><span class="eyebrow">${esc(material.course || "MATERIAL DOCENTE")}</span><h3>${esc(material.title)}</h3><p>${esc(material.topicSummary || "Material didáctico aprobado por el docente.")}</p></div><span class="pill">${(material.lessons?.length || 0) + (material.exercises?.length || 0)} recursos</span></div>
        <div class="published-grid">
          ${(material.lessons || [])
            .map(
              (item, index) => `
            <section class="published-resource"><span class="resource-kind">LECCIÓN · ${esc(item.level || "Intermedio")}</span><h4>${esc(item.title)}</h4><p>${esc(item.everyday || "")}</p><p>${esc(item.concept || "")}</p><details><summary>Por qué funciona y ejemplo comentado</summary><p>${esc(item.why || "")}</p>${item.symbols?.length ? `<ul>${item.symbols.map((symbol) => `<li><code>${esc(symbol.symbol)}</code> · ${esc(symbol.explanation)}</li>`).join("")}</ul>` : ""}<pre><code>${esc(item.exampleC || "")}</code></pre><p class="source-pages">${esc(sourceLabel(item.sourcePages, item.sourceSections))}</p></details><button class="secondary material-open" data-material="${esc(material.id)}" data-kind="lesson" data-index="${index}" type="button">Llevar al laboratorio</button></section>`,
            )
            .join("")}
          ${(material.exercises || [])
            .map(
              (item, index) => `
            <section class="published-resource"><span class="resource-kind">EJERCICIO · ${esc(item.level || "Intermedio")}</span><h4>${esc(item.title)}</h4><p class="everyday-hint">${esc(item.everyday || "")}</p><p>${esc(item.statement || "")}</p><details><summary>Entrada, salida y solución comentada</summary><p><b>Entrada:</b> ${esc(item.input || "")}</p><p><b>Salida:</b> ${esc(item.output || "")}</p><ul>${(item.hints || []).map((hint) => `<li>${esc(hint)}</li>`).join("")}</ul><pre><code>${esc(item.solutionC || "")}</code></pre><p class="source-pages">${esc(sourceLabel(item.sourcePages, item.sourceSections))}</p></details><button class="secondary material-open" data-material="${esc(material.id)}" data-kind="exercise" data-index="${index}" type="button">Probar en el laboratorio</button></section>`,
            )
            .join("")}
        </div>
        <p class="source-pages">Fuente: ${esc(material.source?.title || material.title)} · ${esc(sourceLabel(material.source?.pages, material.source?.sections))}</p>
      </article>`,
      )
      .join("");
    container.querySelectorAll(".material-open").forEach((button) => {
      button.addEventListener("click", () => {
        const material = materials.find((entry) => entry.id === button.dataset.material);
        const type = button.dataset.kind;
        const index = Number(button.dataset.index);
        const item = type === "lesson" ? material.lessons[index] : material.exercises[index];
        load(materialLabItem(material, item, index, type));
        location.hash = "laboratorio";
      });
    });
  } catch {
    $("#published-count").textContent = "Aula pública";
    container.innerHTML =
      '<p class="empty">El catálogo de material docente no está disponible por ahora.</p>';
  }
}

renderPublishedMaterials();
