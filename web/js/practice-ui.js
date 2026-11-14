import { escapeHtml as esc } from "./learning.js";

/** Practice choices always belong to the lesson selected in the main navigation. */
export function createPracticeBrowser(root, { items, lessons, checked, onSelect, onExample }) {
  let active = null,
    parent = null;
  root.innerHTML = `
    <div class="practice-browser-heading">
      <div><h3>Prácticas de esta lección</h3><p id="practice-topic-name"></p></div>
      <button type="button" class="text-button" id="practice-example">Volver al ejemplo guiado</button>
    </div>
    <p class="practice-method">Soluciones comentadas: Inicio → Aplicación → Reto. Estúdialas y vuelve a construirlas en tu laptop.</p>
    <div class="practice-bank-status" role="status"><span id="practice-count"></span><span id="practice-progress"></span></div>
    <div id="practice-list" class="practice-grid" role="group" aria-label="Prácticas de la lección seleccionada"></div>
    <p class="practice-origin">Propuestas propias de Aula C. <a href="#referencias">Referencias universitarias</a>.</p>`;
  const find = (id) => root.querySelector(`#${id}`);
  function refresh() {
    if (!parent) return;
    const visible = items.filter((item) => item.lessonId === parent.id);
    find("practice-count").textContent = `${visible.length} prácticas`;
    find("practice-progress").textContent =
      `${visible.filter((item) => checked(item.path)).length} de ${visible.length} verificadas en esta lección`;
    find("practice-list").innerHTML = visible
      .map(
        (item) => `
      <button type="button" class="practice-card ${active?.id === item.id ? "active" : ""}" data-practice-id="${esc(item.id)}" aria-pressed="${active?.id === item.id}">
        <span class="practice-card-meta"><b>${esc(item.difficulty)}</b><span>${item.minutes} min</span></span>
        <strong>${esc(item.title)}</strong>
        <span class="practice-card-footer">${checked(item.path) ? "Casos verificados" : `Solución · ${item.tests.length} ${item.tests.length === 1 ? "caso" : "casos"}`}</span>
      </button>`,
      )
      .join("");
  }
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-practice-id]");
    if (!button) return;
    const item = items.find((item) => item.id === button.dataset.practiceId && item.lessonId === parent?.id);
    if (item) onSelect(item);
  });
  find("practice-example").onclick = () => {
    if (parent) onExample(parent);
  };
  return {
    render(item) {
      active = item;
      parent = lessons.find((lesson) => lesson.id === (item.lessonId || item.id));
      root.hidden = !parent;
      if (!parent) return;
      find("practice-topic-name").textContent = `${parent.title} · ${parent.level}`;
      find("practice-example").hidden = !item.lessonId;
      refresh();
    },
    refresh,
  };
}

export function practiceTaskMarkup(item) {
  if (!item.lessonId) return "";
  return `<section class="practice-task" aria-label="Contrato de la práctica">
    <p>Usa este ejercicio como referencia de clase. Descarga la solución y reconstruye el programa en tu laptop, justificando cada decisión.</p>
    <p><a class="practice-download" href="/${esc(item.solutionPath)}" download>Descargar solución comentada .c</a></p>
    <div class="practice-contract-grid"><div><h4>Entrada</h4><p>${esc(item.inputDescription)}</p></div><div><h4>Salida esperada</h4><p>${esc(item.outputDescription)}</p></div></div>
    <h4>Condiciones del ejercicio</h4><ul>${item.constraints.map((text) => `<li>${esc(text)}</li>`).join("")}</ul>
    <details><summary>Casos de referencia (${item.tests.length})</summary>
      ${item.tests.map((test, index) => `<div class="practice-case"><h4>${esc(test.name)}</h4><div class="practice-contract-grid"><div><b>Entrada</b><pre>${esc(test.input || "(Sin entrada)")}</pre></div><div><b>Salida · retorno ${test.exitCode ?? 0}</b><pre>${esc(test.output || "(Sin salida)")}</pre></div></div><button type="button" class="text-button" data-practice-case="${index}">Usar esta entrada</button></div>`).join("")}
    </details>
    <h4>Desarrollo de la solución</h4><ol>${item.hints.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    <details class="practice-laptop"><summary>Reconstruir el programa en tu laptop</summary>
      <ol><li>Lee el contrato y escribe tu algoritmo sin copiar el código.</li><li>Crea tu propio archivo .c en Xcode o en un editor con un compilador C.</li><li>Compila, reproduce las entradas y compara con las salidas de referencia.</li><li>Explica los símbolos y cambia un dato o condición para comprobar que entendiste.</li></ol>
      <p>Con GCC o Clang en una terminal de macOS/Linux:</p>
      <pre>cc -std=c17 -Wall -Wextra ${esc(item.solutionPath.split("/").pop())} -o programa
./programa</pre>
      <p>Cuando el programa lea datos, escribe la entrada del caso y confirma con Enter. Los ejercicios de archivos crean sus archivos en la carpeta de ejecución.</p>
    </details>
    <p class="practice-method">${item.practiceMode === "template" ? "Plantilla opcional en el editor. Usa «Ver solución comentada» para volver al desarrollo completo; las líneas (void)variable evitan avisos mientras completas los TODO." : "La solución comentada está en el editor de abajo. Puedes ejecutarla como demostración; la construcción del ejercicio se hace en el equipo del alumno."}</p>
  </section>`;
}

export function bindPracticeTask(root, item, useCase) {
  if (!item.lessonId) return;
  root.querySelectorAll("[data-practice-case]").forEach((button) => {
    button.onclick = () => useCase(Number(button.dataset.practiceCase));
  });
}
