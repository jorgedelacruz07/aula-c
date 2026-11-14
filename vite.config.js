import { defineConfig } from "vite";
import { resolve } from "node:path";
import { SHARED_LIBRARY_PROXY } from "./web/js/admin-library.js";
export const STUDY_PORT = 5183;
export function sharedLibraryProxy() {
  return {
    target: "https://aula-c-docs-api-uwwafcckza-uc.a.run.app",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/library-api/, "/api"),
    configure(proxy) {
      // This is a server-to-server request. Firebase's bearer token remains required.
      proxy.on("proxyReq", (request) => request.removeHeader("origin"));
    },
  };
}
const headers = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};
function crossOriginIsolationPlugin() {
  const applyMiddleware = (server) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url || "/";
      const pathname = url.split("?")[0];
      if (pathname === "/admin" || pathname === "/archivo") {
        req.url = `${pathname}.html${url.slice(pathname.length)}`;
      }
      if (
        !pathname.startsWith("/admin") &&
        !pathname.startsWith("/api") &&
        !pathname.startsWith(SHARED_LIBRARY_PROXY)
      ) {
        for (const [key, value] of Object.entries(headers)) {
          res.setHeader(key, value);
        }
      }
      next();
    });
  };
  return {
    name: "aula-c-coop-coep",
    configureServer: applyMiddleware,
    configurePreviewServer: applyMiddleware,
  };
}

export default defineConfig({
  root: "web",
  plugins: [crossOriginIsolationPlugin()],
  server: {
    host: "127.0.0.1",
    port: STUDY_PORT,
    strictPort: true,
    proxy: {
      "/api": { target: "http://127.0.0.1:5184", changeOrigin: true },
      [SHARED_LIBRARY_PROXY]: sharedLibraryProxy(),
    },
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
