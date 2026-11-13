# Third-party notices

- Tailwind CSS 3.4.19 is used only to build the preserved mentoring page utilities; MIT notice in `TAILWIND-MIT.txt`.
- `@runno/wasi` 0.10.0 — Benjamin Taylor and contributors; [Runno source](https://github.com/taybenlor/runno), MIT. The runtime integration is original application code using its worker host.
- Clang/WebAssembly and wasm-ld artifacts downloaded from [Runno language assets](https://runno.dev/langs/clang.wasm), originating from [binji/wasm-clang](https://github.com/binji/wasm-clang). wasm-clang's repository license is Apache 2.0; its compiler is LLVM/Clang 8, whose release license is included separately.
- The toolchain filesystem includes WASI libc and supporting libraries. [wasi-libc](https://github.com/WebAssembly/wasi-libc) carries multiple upstream notices, retained in `WASI-LIBC.txt`.

Artifacts are pinned by SHA-256 in `scripts/toolchain.json`; the upstream asset endpoint does not identify a source commit. The included upstream notices document attribution; this is not a claim of a reproducible compiler build or a complete dependency license audit. Review provenance and notices before broad external redistribution.
