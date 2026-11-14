import test from "node:test";
import assert from "node:assert/strict";
import { practices, practiceLabItem } from "../web/js/practices.js";
import { lessons } from "../web/js/curriculum.js";
import { practiceTaskMarkup, bindPracticeTask, createPracticeBrowser } from "../web/js/practice-ui.js";

const items = practices.map((practice) => practiceLabItem(practice));

test("Practice choices and progress follow only the active lesson, with no duplicate filters", () => {
  const controls = new Map();
  const node = (id) => {
    if (!controls.has(id)) controls.set(id, { hidden: false });
    return controls.get(id);
  };
  let click, returned, selected;
  const root = {
    querySelector: node,
    addEventListener(_, callback) {
      click = callback;
    },
  };
  const verified = new Set([items[0].path, items.find((item) => item.lessonId === "05-ciclos").path]);
  const browser = createPracticeBrowser(root, {
    items,
    lessons,
    checked: (path) => verified.has(path),
    onSelect(item) {
      selected = item;
    },
    onExample(item) {
      returned = item;
    },
  });
  assert(!/<select|<input/.test(root.innerHTML), "Global navigation must not reappear inside a lesson");
  for (const lesson of lessons) {
    browser.render(lesson);
    const group = items.filter((item) => item.lessonId === lesson.id);
    const visibleIds = [...node("#practice-list").innerHTML.matchAll(/data-practice-id="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(
      visibleIds,
      group.map((item) => item.id),
      lesson.id,
    );
    assert.equal(root.hidden, false);
    assert.equal(
      node("#practice-progress").textContent,
      `${group.filter((item) => verified.has(item.path)).length} de 3 verificadas en esta lección`,
    );
    assert.equal(node("#practice-example").hidden, true);
  }
  const practice = items.find((item) => item.lessonId === "05-ciclos");
  browser.render(practice);
  assert(node("#practice-list").innerHTML.includes('class="practice-card active"'));
  assert.equal(node("#practice-example").hidden, false);
  node("#practice-example").onclick();
  assert.equal(returned.id, "05-ciclos");
  const clickCard = (id) => click({ target: { closest: () => ({ dataset: { practiceId: id } }) } });
  clickCard(practice.id);
  assert.equal(selected.id, practice.id);
  selected = null;
  browser.render(lessons[0]);
  clickCard(practice.id);
  assert.equal(selected, null, "A stale card must not switch to another lesson's practice");
  verified.add(items[1].path);
  browser.refresh();
  assert.equal(node("#practice-progress").textContent, "2 de 3 verificadas en esta lección");
  browser.render({ id: "external-item" });
  assert.equal(root.hidden, true);
});

test("Solved exercises show their development and download, with optional template mode separate", () => {
  assert.equal(practiceTaskMarkup(lessons[0]), "");
  const item = items[0];
  const markup = practiceTaskMarkup(item);
  assert(markup.includes("Desarrollo de la solución"));
  assert(markup.includes("Reconstruir el programa en tu laptop"));
  assert(markup.includes(`href="/${item.solutionPath}" download`));
  assert(markup.includes("Casos de referencia"));
  assert(markup.includes('data-practice-case="0"'));
  assert(
    !markup.includes("data-practice-solution"),
    "The solution must no longer be hidden behind another panel",
  );
  assert(!practiceTaskMarkup({ ...item, constraints: ['<img src=x onerror="bad">'] }).includes("<img"));
  const template = practiceLabItem(practices[0], "template");
  assert.notEqual(template.path, item.path);
  assert(practiceTaskMarkup(template).includes(`href="/${item.solutionPath}" download`));
  let choose, selectedCase;
  const button = {
    dataset: { practiceCase: "0" },
    set onclick(callback) {
      choose = callback;
    },
  };
  bindPracticeTask({ querySelectorAll: () => [button] }, item, (index) => {
    selectedCase = index;
  });
  choose();
  assert.equal(selectedCase, 0);
});
