import { exercises } from "./catalog.js";

const recipes = [
  [
    "Parejas y tríos adyacentes",
    "Avanza divisores decimales: con copia >= 10 extraes dos cifras; con copia >= 100, tres.",
    "Para 5274: parejas 74, 27, 52. En cada vuelta, desplaza copia /= 10.",
    "int pareja = (n / pot) % 100;",
    "Mientras copia >= 100: grupo <- copia MOD 1000; copia <- trunc(copia / 10).",
  ],
  [
    "Recorrer izquierda a derecha",
    "Cuenta cifras iterativamente y parte desde 10^(cifras-1); extrae cada dígito y baja la potencia.",
    "524: potencias 100, 10, 1 producen 5, 2, 4.",
    "for (p = maximo; p > 0; p /= 10) d = (n/p)%10;",
    "Para p <- potencia_max Hasta 1 Con Paso -1: dig <- trunc(n/p) MOD 10.",
  ],
  [
    "Reemplazar un dígito",
    "Aísla la posición con una potencia de diez y suma la diferencia entre dígito nuevo y anterior.",
    "En 538, posición de decenas, pot=10: 538 - 3*10 + 7*10 = 578.",
    "nuevo = num - dig*pot + nuevo_dig*pot;",
    "nuevo <- num - dig*pot + nuevo_dig*pot.",
  ],
  [
    "Dígitos todos distintos",
    "Compara cada dígito con los que quedan a su derecha mediante dos recorridos aritméticos.",
    "Para cada extracción exterior, copia el sufijo y compara sus cifras; igualdad = repetido.",
    "for (a=n; a>0; a/=10) for (b=a/10; b>0; b/=10) ...",
    "Para cada cifra exterior, recorrer las cifras restantes y marcar repetida.",
  ],
  [
    "Anagramas numéricos",
    "Compara, dígito por dígito de 0 a 9, las frecuencias calculadas con módulo y división.",
    "153 y 351 tienen frecuencia 1 para 1, 3 y 5, y 0 para los otros dígitos.",
    "for (d=0; d<=9; d++) if(freq(a,d)!=freq(b,d)) igual=0;",
    "Para dig <- 0 Hasta 9: comparar frecuencia(num1,dig) y frecuencia(num2,dig).",
  ],
  [
    "Divisores propios y factores",
    "Con el 1: d desde 1 hasta n-1. Sin el 1: d desde 2 hasta n-1. Para factorizar, divide sucesivamente y cuenta exponente.",
    "12: propios con 1 = 1,2,3,4,6. Sin 1 = 2,3,4,6.",
    "for (d=limite_inferior; d<n; d++) if(n%d==0) ...",
    "Para d <- inicio Hasta n-1: Si n MOD d = 0 Entonces acumular.",
  ],
  [
    "Variables deslizantes",
    "Guarda solo los valores previos requeridos; calcula siguiente y desplaza las variables.",
    "Tribonacci: (a,b,c)=(0,1,1) → sig=2 → (1,1,2).",
    "sig=a+b+c; a=b; b=c; c=sig;",
    "siguiente <- a+b+c; a <- b; b <- c; c <- siguiente.",
  ],
  [
    "Combinatorio en un for",
    "Acumula p!, r! y (p-r)! en el mismo recorrido, actualizando los factoriales con dos condiciones.",
    "C(5,2): el recorrido 1..5 agrega cada factor al acumulador que corresponda.",
    "fact_p = fact_r = fact_pr = 1; for(i=1;i<=p;i++){fact_p*=i; if(i<=r)fact_r*=i; if(i<=p-r)fact_pr*=i;}",
    "Asignación en cascada; Para i <- 1 Hasta p: multiplicar p! y condicionalmente los otros factoriales.",
  ],
  [
    "Triángulos I, D, H, A, L",
    "Dos ciclos: filas afuera, columnas/espacios adentro. Decide imprimir * o espacio con una condición por figura.",
    "En fila f del triángulo I, imprime estrellas para c <= f.",
    "for(f=1;f<=alto;f++) for(c=1;c<=alto;c++) putchar(cond?'*':' ');",
    "Para fila <- 1 Hasta alto; para columna; escribir estrella o espacio sin salto.",
  ],
  [
    "Cuota arquitectónica",
    "Divide lectura, validación, cálculo, presentación y evaluaciones. Asegura ciclos en main y submódulos; reserva dos punteros de salida para cálculo.",
    "Dibuja llamadas: main → leer → evaluar(*r1,*r2) → imprimir. Marca el centinela y el contador.",
    "void evaluar(int x, int *salida1, int *salida2);",
    "Módulo evaluar devuelve simultáneamente dos resultados por referencia; no es el lector.",
  ],
].map(([title, idea, trace, c, psi], i) => ({ title, idea, trace, c, psi, n: i + 1 }));

const quiz = [
  {
    q: "¿Qué falla en esta condición?",
    code: 'if (a = 5) { printf("si"); }',
    options: ["Compara a con 5", "Asigna 5 a y prueba el valor", "Error de sintaxis"],
    answer: 1,
    why: "Un solo = asigna. Para comparar igualdad se usa ==.",
  },
  {
    q: "¿Qué significa esta comparación?",
    code: "if (a == b == c)",
    options: [
      "a, b y c son iguales",
      "(a == b) se convierte a 0/1 y luego se compara con c",
      "Error de sintaxis",
    ],
    answer: 1,
    why: "La igualdad es asociativa por la izquierda. Compara (a==b) con c; escribe a==b && b==c.",
  },
  {
    q: "¿Cuál es el riesgo de este producto?",
    code: "int factorial = 1;\nfor (i=1; i<=13; i++) factorial *= i;",
    options: ["No compila por for", "13! desborda int típico de 32 bits", "Siempre calcula 13! exactamente"],
    answer: 1,
    why: "13! = 6 227 020 800, mayor que INT_MAX de 32 bits.",
  },
  {
    q: "¿Qué valor resulta?",
    code: "int x = 1 / 5;",
    options: ["0.2", "0", "Error"],
    answer: 1,
    why: "Ambos operandos son enteros: se realiza división entera antes de asignar.",
  },
  {
    q: "¿Qué rompe este break?",
    code: "while (i < 3) {\n  while (j < 3) {\n    break;\n  }\n}",
    options: ["Ambos while", "Solo el while interno", "El programa completo"],
    answer: 1,
    why: "break termina únicamente el ciclo más interno que lo contiene.",
  },
  {
    q: "¿Qué hace realmente?",
    code: "*cont++;",
    options: ["Incrementa el valor apuntado", "Incrementa el puntero cont", "Error siempre"],
    answer: 1,
    why: "El ++ tiene mayor precedencia que *. Equivale a *(cont++). Usa (*cont)++.",
  },
  {
    q: "¿Cómo comparar doubles con tolerancia?",
    code: "if (a == b)",
    options: ["Usar igualdad exacta siempre", "Usar fabs(a-b) < epsilon", "Convertirlos a int"],
    answer: 1,
    why: "Los redondeos binarios hacen frágil la igualdad exacta; compara distancia con tolerancia.",
  },
  {
    q: "¿Qué imprime?",
    code: 'for (i=1; i<=2; i++)\n  for (j=1; j<=2; j++) printf("%d%d ",i,j);',
    options: ["11 12 21 22", "11 21 12 22", "12 22"],
    answer: 0,
    why: "El bucle externo fija i y el interno recorre j completo antes de avanzar i.",
  },
  {
    q: "¿Por qué scanf no lleva & aquí?",
    code: 'void leer(int *p) { scanf("%d", p); }',
    options: [
      "scanf nunca lleva &",
      "p ya contiene la dirección de la variable destino",
      "C lo agrega automáticamente",
    ],
    answer: 1,
    why: "El parámetro p ya es un puntero. Si fuera una variable int local, pasarías &x.",
  },
  {
    q: "¿Qué hace continue dentro del for?",
    code: 'for (i=0; i<5; i++) {\n  if (i==2) continue;\n  printf("%d",i);\n}',
    options: ["Imprime 01234", "Imprime 0134", "Se detiene en 2"],
    answer: 1,
    why: "Salta al siguiente ciclo; en un for también ejecuta la actualización i++.",
  },
];

const $ = (s) => document.querySelector(s);

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

function renderRecipes() {
  const root = $("#recipe-grid");
  recipes.forEach((r) => {
    const card = document.createElement("details");
    card.className = "panel recipe-card p-4";
    card.innerHTML = `<summary class="font-bold cursor-pointer" style="color:var(--ink);">Técnica ${r.n}: ${r.title}</summary><p class="text-xs mt-2" style="color:var(--ink-secondary);">${r.idea}</p><p class="text-xs mt-1.5" style="color:var(--blue);"><b>Traza:</b> ${r.trace}</p><pre class="language-c mt-2"><code class="language-c">${escapeHtml(r.c)}</code></pre><p class="text-xs mt-1.5" style="color:var(--muted);"><b>PSeInt:</b> ${escapeHtml(r.psi)}</p>`;
    root.append(card);
  });
  Prism.highlightAll();
}
function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function initStack() {
  const steps = [
    ["main crea sus variables", "suma", "producto", "sin crear"],
    [
      "main pasa direcciones con &",
      "&suma → 0x7ffee4a0",
      "&producto → 0x7ffee4a4",
      "marcos: main + calcular",
    ],
    [
      "el módulo inicializa por referencia",
      "*p_suma = 0",
      "*p_producto = 1",
      "p_suma y p_producto apuntan a main",
    ],
    ["procesa la cifra 5", "suma=5", "producto=5", "num pasa de 235 a 23"],
    ["procesa la cifra 3", "suma=8", "producto=15", "num pasa de 23 a 2"],
    ["procesa la cifra 2 y retorna", "suma=10", "producto=30", "se libera el marco del módulo"],
  ];
  let i = -1;
  const show = () => {
    const [caption, a, b, c] = steps[i] || [
      "Pulsa “Siguiente línea” para iniciar la traza.",
      "suma",
      "producto",
      "sin crear",
    ];
    $("#stack-caption").textContent = caption;
    $("#memory-view").innerHTML =
      `<div class="memory-cell"><div class="address">main · 0x7ffee4a0</div><div class="font-mono">suma</div><div class="value">${a}</div></div><div class="memory-cell"><div class="address">main · 0x7ffee4a4</div><div class="font-mono">producto</div><div class="value">${b}</div></div><div class="memory-cell col-span-2"><div class="address">Pila de llamadas</div><div>${c}</div></div>`;
  };
  $("#stack-next").onclick = () => {
    i = Math.min(i + 1, steps.length - 1);
    show();
  };
  $("#stack-reset").onclick = () => {
    i = -1;
    show();
  };
  show();
}
function filtered() {
  const stage = $("#stage-filter").value,
    level = $("#level-filter").value,
    query = $("#search-filter").value.toLowerCase();
  return exercises.filter(
    (x) =>
      (stage === "all" || (stage === "old" ? x.stage === "Parcial" : x.stage === "Anidados")) &&
      (level === "all" || x.level === level) &&
      (x.id + " " + x.title).toLowerCase().includes(query),
  );
}
function renderList(selected = "") {
  const root = $("#exercise-list");
  root.replaceChildren();
  filtered().forEach((x) => {
    const b = document.createElement("button");
    b.className = "exercise-button w-full block mb-2 " + (selected === x.id ? "active" : "");
    b.textContent = `${x.id} · ${x.title}`;
    b.onclick = () => loadExercise(x);
    root.append(b);
  });
}
function explain(line) {
  const t = line.trim();
  if (!t) return "Espacio o separación para organizar el código.";
  if (t.startsWith("#include")) return "Importa declaraciones de la biblioteca estándar.";
  if (t.includes("main(")) return "Punto de entrada: aquí empieza la ejecución del programa.";
  if (t.startsWith("/*") || t.startsWith("*") || t.startsWith("//"))
    return "Comentario pedagógico o nota técnica.";
  if (t.endsWith(";")) return "Instrucción completa; revisa qué variable cambia o qué función se invoca.";
  if (t.includes("for") || t.includes("while"))
    return "Controla una repetición; identifica inicialización, condición, actualización y posible anidación.";
  if (t.includes("if")) return "Decisión condicional: el bloque se ejecuta cuando la expresión es verdadera.";
  if (t.includes("}")) return "Cierra un bloque y devuelve el control al nivel que lo llamó.";
  return "Declaración, encabezado de función o estructura del módulo.";
}
async function loadExercise(x) {
  renderList(x.id);
  const view = $("#exercise-view");
  view.innerHTML = '<p class="text-cyan-200">Cargando fuente local…</p>';
  try {
    const response = await fetch("../" + x.path);
    if (!response.ok) throw new Error("No se encontró " + x.path);
    const source = await response.text();
    const testData = await fetch("tests.json").then((r) => r.json());
    const tests = testData[x.id] || [];
    const modules = [...source.matchAll(/^(?:void|int|double)\s+([A-Za-z_]\w*)\s*\([^;]*\)\s*\{/gm)].map(
      (m) => m[1],
    );
    const notes = source
      .split("\n")
      .map(
        (line, i) =>
          `<div class="line-note"><span class="text-slate-500">${String(i + 1).padStart(3, "0")}</span> ${escapeHtml(line || " ")}<div class="text-slate-500">${escapeHtml(explain(line))}</div></div>`,
      )
      .join("");
    const testHtml = tests.length
      ? tests
          .map(
            (t, i) =>
              `<div class="border-t pt-3 mt-3" style="border-color:var(--line);"><div class="flex justify-between items-center gap-3"><b class="text-xs" style="color:var(--ink);">${escapeHtml(t.name)}</b><button class="button-secondary copy-case" data-case="${i}">Copiar entrada</button></div><pre class="case-input mt-2 p-2.5 rounded-md font-mono text-xs overflow-auto" style="background:var(--code-bg);color:var(--code-ink);border:1px solid var(--line);">${escapeHtml(t.input)}</pre><details class="mt-2 text-xs"><summary class="cursor-pointer font-bold" style="color:var(--muted);">Salida esperada</summary><pre class="mt-1.5 p-2.5 rounded-md font-mono text-xs overflow-auto" style="background:var(--code-bg);color:var(--code-ink);border:1px solid var(--line);">${escapeHtml(t.output)}</pre></details></div>`,
          )
          .join("")
      : '<p class="mt-3 text-xs" style="color:var(--muted);">Aún no hay casos guardados para esta clave.</p>';
    view.innerHTML = `<div><span class="tag ${x.stage === "Anidados" ? "tag-cyan" : "tag-slate"}">${x.stage === "Anidados" ? "Guías 8-9" : "Guías 1-6"} · ${x.level}</span><h3 class="text-xl font-bold mt-1.5" style="color:var(--ink);">${x.id} · ${x.title}</h3></div><p class="mt-3 text-xs" style="color:var(--ink-secondary);"><b>Árbol Top-Down:</b> main() → ${modules.filter((m) => m !== "main").join(" → ") || "funciones auxiliares por identificar"}</p><details class="mt-3"><summary class="cursor-pointer font-bold text-xs" style="color:var(--ink);">Código C completo</summary><pre class="language-c mt-2"><code class="language-c">${escapeHtml(source)}</code></pre></details><details class="mt-2"><summary class="cursor-pointer font-bold text-xs" style="color:var(--ink);">Guía línea por línea</summary><div class="mt-2 max-h-80 overflow-auto">${notes}</div></details><details class="mt-2" open><summary class="cursor-pointer font-bold text-xs" style="color:var(--ink);">Casos de prueba (${tests.length})</summary>${testHtml}</details>`;
    view
      .querySelectorAll(".copy-case")
      .forEach(
        (b) => (b.onclick = () => navigator.clipboard?.writeText(tests[Number(b.dataset.case)].input)),
      );
    Prism.highlightAll();
  } catch (e) {
    view.textContent = `No se pudo cargar el archivo: ${e.message}. Inicia el servidor desde la raíz con make web.`;
  }
}
function initQuiz() {
  let i = 0;
  const paint = () => {
    const q = quiz[i];
    $("#quiz-count").textContent = `Reto ${i + 1} de ${quiz.length}`;
    $("#quiz-question").textContent = q.q;
    $("#quiz-code").textContent = q.code;
    $("#quiz-feedback").textContent = "";
    $("#quiz-feedback").className = "mt-4 min-h-6";
    const opts = $("#quiz-options");
    opts.replaceChildren();
    q.options.forEach((o, j) => {
      const b = document.createElement("button");
      b.className = "quiz-option";
      b.textContent = o;
      b.onclick = () => {
        $("#quiz-feedback").textContent = (j === q.answer ? "Correcto. " : "Revisa la precedencia. ") + q.why;
        $("#quiz-feedback").classList.add(j === q.answer ? "feedback-good" : "feedback-bad");
        [...opts.children].forEach((x) => (x.disabled = true));
      };
      opts.append(b);
    });
    Prism.highlightAll();
  };
  $("#quiz-next").onclick = () => {
    i = (i + 1) % quiz.length;
    paint();
  };
  paint();
}
$("#stage-filter").onchange = () => renderList();
$("#level-filter").onchange = () => renderList();
$("#search-filter").oninput = () => renderList();
renderRecipes();
initStack();
initQuiz();
renderList();
