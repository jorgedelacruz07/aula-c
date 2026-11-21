---
name: aulac-exercise-author
description: Use when adding or editing an Aula C teaching exercise or practice (C source, stdin/stdout fixtures, lesson wiring, teacher guidance) so it passes the repo's compile-and-fixture gates and the WebAssembly lab.
---

# Aula C Exercise Author

## When to use this skill

- Adding a practice to `web/js/practice-content/<NN>-<topic>.js` and its solution in `lecciones/practicas/`.
- Adding or changing an archive exercise (`ejercicios/`, fixtures in `pruebas/`, catalog entry in `web/js/catalog.js`).
- Editing fixtures, hints, teacher details or the lesson program in `lecciones/`.

## Rules

- **Source of truth is the `.c` file.** The reference solution lives only in its canonical C file (`solutionPath`); the JS entry holds metadata, a starter (`sourceC`) and fixtures. Never duplicate the solution into the JS entry.
- **Compile clean.** Solutions and starters must build with `clang -std=c17 -Wall -Wextra -Werror -pedantic`. The in-browser lab compiles with `-Wall -Wextra -pedantic` for `c17` or `c89`; avoid anything that needs a native-only feature (threads, sockets, process spawning, files outside the virtual `/` drive).
- **Teaching comments are mandatory.** Reference solutions need `/* ... */` comments that explain intent, not syntax noise.
- **Fixtures are exact.** Each test has `name`, `input` (stdin, at most 4096 bytes) and `output` (stdout, compared byte-for-byte including whitespace and trailing newline); add `exitCode` only when it is not 0. Cover the happy path, a boundary and one common mistake. Source and output are limited to 64 KiB.
- **Respect lesson constraints.** Practices inside a lesson may only use what the lesson has introduced (see `extraSymbols` in `web/js/practices.js`); archive exercises keep their academic restrictions (`make reglas`, e.g. no `for`/`break`/`[]` where the course forbids them).
- **Wire the metadata.** Every practice needs `id`, `lessonId`, `title`, `difficulty`, `minutes`, `statement`, input/output descriptions, `constraints`, `hints`, `solutionPath`, `tests`, `concept`, `why`, `trap`, `teacher`, `challenge` and `teacherDetails` (questions, blindspots, rubric). Keep the mix per lesson (basic/intermediate/advanced) as documented in `docs/PRACTICAS.md`; update counts in docs and tests when you change them.
- **Original content only.** No copied course statements; use synthetic data, no personal names, emails or secrets.
- **Do not weaken gates.** Never relax an assertion, skip a fixture or lower a count to make a test pass; fix the exercise.

## Steps

1. Draft the `.c` solution with comments; compile it natively with the clang flags above and run each fixture by hand.
2. Add the starter (`sourceC`), fixtures and metadata to the topic file; for archive items add the `pruebas/*.in|.out` pair and catalog entry.
3. Run `node --test scripts/practices.test.mjs scripts/quality.test.mjs`, then the C checks (`npm run test:c`) when an archive exercise changed.
4. Run `npm run quick` (non-mutating). Use `npm run quick:fix` only to apply Prettier formatting first.
5. Update `docs/PRACTICAS.md` and `PROJECT_BRAIN/` entries when counts or behaviour change.

## Checks before finishing

- `npm run quick` exits 0 (format check, tests, build, `git diff --check`).
- The new practice appears in the built catalog and its reference run in the lab passes every fixture.
- `git status` shows only intended files; generated `web/public/` and `dist/` stay untracked.
