import { lessons } from "./curriculum.js";
import { symbols, passes, escapeHtml as esc } from "./learning.js";
import { CRunner } from "./runner.js";
const $ = (selector) => document.querySelector(selector);
const runner = new CRunner();
const storageKey = "aula-c:v1";
let saved;
try {
  saved = JSON.parse(localStorage.getItem(storageKey));
} catch {
  /* Private browsing may disable storage. */
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
function updateProgress() {
  const count = lessons.filter((item) => typeof state.checked[item.path] === "string").length;
  $("#progress").textContent = `${count} de ${lessons.length} casos verificados`;
}
function renderLessons() {
  const visible = lessons.filter(
    (item) =>
      ($("#level").value === "all" || item.level === $("#level").value) &&
      ($("#topic").value === "all" || item.topic === $("#topic").value) &&
      `${item.title} ${item.topic} ${item.concept}`
        .toLocaleLowerCase("es")
        .includes($("#search").value.toLocaleLowerCase("es")),
  );
  $("#lesson-count").textContent = visible.length;
  $("#lesson-list").innerHTML =
    visible
      .map(
        (item) =>
          `<button class="lesson-button ${selected?.id === item.id ? "active" : ""}" data-lesson="${item.id}" aria-pressed="${selected?.id === item.id}"><span>${item.id.slice(0, 2)}</span><div>${esc(item.title)}<small>${item.minutes} min · ${state.checked[item.path] ? "Caso verificado ✓" : esc(item.topic)}</small></div></button>`,
      )
      .join("") || '<p class="empty">No hay lecciones con estos filtros.</p>';
  document
    .querySelectorAll("[data-lesson]")
    .forEach(
      (button) => (button.onclick = () => load(lessons.find((item) => item.id === button.dataset.lesson))),
    );
}
function explain(symbol) {
  $("#symbol-explanation").textContent = symbols[symbol] || "";
  document
    .querySelectorAll("[data-symbol]")
    .forEach((button) => button.classList.toggle("active", button.dataset.symbol === symbol));
}
function theory(item) {
  const isLesson = !!item.concept;
  $("#lesson-content").innerHTML =
    `<div class="lesson-meta"><span>${esc(item.level)}</span><span> / ${esc(item.topic)}</span><span>${isLesson ? ` / ${item.minutes} min de práctica` : ` / Perfil ${esc(item.stage)}`}</span></div><h3>${esc(item.title)}</h3><p class="lesson-concept">${esc(item.concept || "Lee el encabezado y los contratos de las funciones. Predice la salida, selecciona un caso disponible y compara tu razonamiento con la ejecución.")}</p><div class="explanation"><b>EL PORQUÉ</b>${esc(item.why || "Este programa se carga desde su archivo original. Las restricciones de su perfil pertenecen al material de práctica: C general también permite arreglos, estructuras y otros ciclos. El compilador C89 comprueba sintaxis de ese estándar, no las reglas académicas particulares.")}</div><div class="symbols">${(item.symbols || ["&", "*", "%d", "while", "return"]).map((symbol) => `<button class="symbol" data-symbol="${esc(symbol)}">${esc(symbol)}</button>`).join("")}</div><p id="symbol-explanation" aria-live="polite"></p><details class="concept-details"><summary>Un error que vale la pena entender</summary><p>${esc(item.trap || "Valida las conversiones de scanf, los divisores y los límites antes de operar. Que un programa compile no garantiza que su resultado sea correcto.")}</p></details><details class="concept-details"><summary>Ahora te toca: modifica y explica</summary><p>${esc(item.challenge || "Añade un caso límite, justifica su salida y explica la responsabilidad de cada función. Los casos guardados no cubren necesariamente todo el dominio.")}</p></details><div class="teacher-content" ${$("#teacher-mode").checked ? "" : "hidden"}><b>PARA TU SIGUIENTE CLASE</b><p>${esc(item.teacher || "Dibuja el flujo entre módulos. Pide al alumno elegir una variable y describir su tipo, propósito, rango y duración; después solicita una prueba que pueda refutar su solución.")}</p></div>`;
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
  busy(true);
  try {
    const response = await fetch("/" + item.path);
    if (!response.ok) throw new Error("No se pudo cargar el archivo C.");
    const source = await response.text();
    if (version !== loadVersion) return;
    original = source;
    $("#source").value = state.drafts[item.path] ?? source;
    $("#test-case").innerHTML = item.tests.length
      ? item.tests.map((test, i) => `<option value="${i}">${esc(test.name)}</option>`).join("")
      : "<option>Sin casos guardados</option>";
    $("#stdin").value = item.tests[0]?.input || "";
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
      if (allPassed && $("#source").value === code && lessons.some((lesson) => lesson.path === item.path))
        state.checked[item.path] = code;
      else delete state.checked[item.path];
      persist();
      updateProgress();
      renderLessons();
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
  const query = $("#exercise-search").value.toLocaleLowerCase("es");
  const visible = catalog.filter(
    (item) =>
      ($("#exercise-stage").value === "all" || item.stage === $("#exercise-stage").value) &&
      ($("#exercise-level").value === "all" || item.level === $("#exercise-level").value) &&
      `${item.title} ${item.id} ${item.topic}`.toLocaleLowerCase("es").includes(query),
  );
  $("#exercise-count").textContent = `${visible.length} de ${catalog.length} ejercicios`;
  $("#exercise-list").innerHTML =
    visible
      .map(
        (item, i) =>
          `<button class="exercise-card" data-exercise="${i}"><small>${esc(item.stage)} · ${esc(item.level)}</small><h3>${esc(item.title)}</h3><span>${item.tests.length ? `${item.tests.length} casos disponibles` : "Exploración libre · sin pruebas"} ↗</span></button>`,
      )
      .join("") || '<p class="empty">No hay ejercicios con esos filtros.</p>';
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
for (const id of ["exercise-stage", "exercise-level", "exercise-search"])
  $(`#${id}`).addEventListener("input", renderExercises);
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
