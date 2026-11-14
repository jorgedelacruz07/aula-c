import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { adminLibraries, chooseAdminLibrary, SHARED_LIBRARY_PROXY } from "../web/js/admin-library.js";
import viteConfig, { sharedLibraryProxy } from "../vite.config.js";

test("Local administration defaults to the shared library and keeps expiring test uploads separate", () => {
  const libraries = adminLibraries({ development: true, apiBase: "/api" });
  const main = chooseAdminLibrary(libraries);
  assert.equal(main.id, "main");
  assert.equal(main.apiBase, SHARED_LIBRARY_PROXY);
  assert.equal(chooseAdminLibrary(libraries, "local").apiBase, "/api");
  assert.notEqual(main.apiBase, chooseAdminLibrary(libraries, "local").apiBase);
  assert.equal(chooseAdminLibrary(libraries, "unknown").id, "main");
});

test("Production ignores a saved test-library preference and uses its configured knowledge API", () => {
  const configured = "https://example.test/api";
  const libraries = adminLibraries({ development: false, apiBase: configured });
  assert.equal(libraries.length, 1);
  assert.equal(chooseAdminLibrary(libraries, "local").id, "main");
  assert.equal(chooseAdminLibrary(libraries, "local").apiBase, configured);
});

test("The shared-library proxy preserves the requested document path and Firebase authorization", () => {
  const proxy = sharedLibraryProxy();
  assert.equal(viteConfig.server.proxy[SHARED_LIBRARY_PROXY].target, proxy.target);
  assert.equal(proxy.target, "https://aula-c-docs-api-uwwafcckza-uc.a.run.app");
  assert.equal(
    proxy.rewrite(SHARED_LIBRARY_PROXY + "/admin/documents/example?view=draft"),
    "/api/admin/documents/example?view=draft",
  );
  const emitter = new EventEmitter();
  const headers = { origin: "http://localhost:5183", authorization: "Bearer firebase-id-token" };
  proxy.configure(emitter);
  emitter.emit("proxyReq", { removeHeader: (name) => delete headers[name] });
  assert.equal(headers.origin, undefined);
  assert.equal(headers.authorization, "Bearer firebase-id-token");
});
