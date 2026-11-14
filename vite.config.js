import { defineConfig } from "vite";
import { resolve } from "node:path";
export const STUDY_PORT = 5183;
const headers = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};
function crossOriginIsolationPlugin() {
  return {
    name: "aula-c-coop-coep",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        if (!url.startsWith("/admin") && !url.startsWith("/api")) {
          for (const [key, value] of Object.entries(headers)) {
            res.setHeader(key, value);
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        if (!url.startsWith("/admin") && !url.startsWith("/api")) {
          for (const [key, value] of Object.entries(headers)) {
            res.setHeader(key, value);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: "web",
  plugins: [crossOriginIsolationPlugin()],
  server: {
    host: "127.0.0.1",
    port: STUDY_PORT,
    strictPort: true,
    proxy: { "/api": { target: "http://127.0.0.1:5184", changeOrigin: true } },
  },
  preview: { host: "127.0.0.1", port: STUDY_PORT, strictPort: true },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: resolve("web/index.html"),
        archivo: resolve("web/archivo.html"),
        admin: resolve("web/admin.html"),
      },
    },
  },
});
