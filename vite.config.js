import { defineConfig } from "vite";
import { resolve } from "node:path";
export const STUDY_PORT = 5183;
const headers = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};
export default defineConfig({
  root: "web",
  server: { host: "127.0.0.1", port: STUDY_PORT, strictPort: true, headers },
  preview: { host: "127.0.0.1", port: STUDY_PORT, strictPort: true, headers },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rolldownOptions: { input: { main: resolve("web/index.html"), archivo: resolve("web/archivo.html") } },
  },
});
