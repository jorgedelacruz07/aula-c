import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import "./test-network-guard.mjs";
import {
  createCorsOriginPolicy,
  createLivenessPayload,
  isExactHttpOrigin,
  normalizeLoopbackHostname,
  parseConfiguredCorsOrigins,
  resolveListenHostname,
  resolveRuntimeMode,
} from "../api/security-baseline.mjs";
import { createApiServer } from "../api/server.mjs";

test("runtime mode fails closed on missing, unknown or contradictory markers", () => {
  assert.throws(() => resolveRuntimeMode({}), /set NODE_ENV/);
  assert.throws(() => resolveRuntimeMode({ NODE_ENV: "staging" }), /received staging/);
  assert.throws(() => resolveRuntimeMode({ NODE_ENV: "development", K_SERVICE: "svc" }), /K_SERVICE/);
  assert.equal(resolveRuntimeMode({ K_SERVICE: "svc" }), "production");
  assert.equal(resolveRuntimeMode({ NODE_ENV: "test" }), "test");
});

test("listen host is loopback outside production and 0.0.0.0 on Cloud Run", () => {
  assert.equal(resolveListenHostname({ NODE_ENV: "development" }), "127.0.0.1");
  assert.equal(resolveListenHostname({ NODE_ENV: "test", API_HOST: "::1" }), "::1");
  assert.equal(resolveListenHostname({ NODE_ENV: "production" }), "0.0.0.0");
  assert.equal(resolveListenHostname({ K_SERVICE: "aula-c-docs-api" }), "0.0.0.0");
  for (const API_HOST of ["0.0.0.0", "127.attacker.invalid", "127.999.0.1", "192.168.1.5", "example.com"]) {
    assert.throws(
      () => resolveListenHostname({ NODE_ENV: "development", API_HOST }),
      /Unsafe development bind/,
    );
  }
  assert.equal(normalizeLoopbackHostname("127.1.2.3"), "127.1.2.3");
  assert.equal(normalizeLoopbackHostname(" LOCALHOST "), "localhost");
  assert.throws(() => resolveListenHostname({}), /set NODE_ENV/);
});

test("CORS origins must be exact HTTP(S) origins; previews are opt-in and project scoped", () => {
  assert.deepEqual(parseConfiguredCorsOrigins(" https://a.example , http://127.0.0.1:5183 "), [
    "https://a.example",
    "http://127.0.0.1:5183",
  ]);
  for (const bad of [
    "*",
    "https://a.example/",
    "https://a.example/path",
    "https://u:p@a.example",
    "a.example",
    "https://a.example,",
  ]) {
    assert.throws(() => parseConfiguredCorsOrigins(bad), /Invalid ALLOWED_ORIGINS/);
  }
  assert.equal(isExactHttpOrigin("https://aula-c-jorge.web.app"), true);
  const exactOnly = createCorsOriginPolicy({ origins: ["https://aula-c-jorge.web.app"] });
  assert.equal(exactOnly.isAllowedOrigin("https://aula-c-jorge.web.app"), true);
  assert.equal(exactOnly.isAllowedOrigin("https://aula-c-jorge--pr1-abc123.web.app"), false);
  const withPreview = createCorsOriginPolicy({
    origins: ["https://aula-c-jorge.web.app"],
    firebaseProjectIds: ["aula-c-jorge"],
  });
  assert.equal(withPreview.isAllowedOrigin("https://aula-c-jorge--pr1-abc123.web.app"), true);
  assert.equal(withPreview.isAllowedOrigin("https://other-project--pr1-abc123.web.app"), false);
  assert.equal(withPreview.isAllowedOrigin("http://aula-c-jorge--pr1-abc123.web.app"), false);
  assert.throws(
    () => createCorsOriginPolicy({ firebaseProjectIds: ["Bad_ID"] }),
    /Invalid Firebase project ID/,
  );
});

test("liveness payload carries no configuration, memory or uptime details", () => {
  const payload = createLivenessPayload({ now: () => new Date("2026-01-01T00:00:00Z") });
  assert.deepEqual(payload, { status: "healthy", timestamp: "2026-01-01T00:00:00.000Z" });
});

async function withServer(options, callback) {
  const server = createApiServer({ bucketName: "private-bucket", apiKey: "k", ...options });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test("API /api/health is liveness-only and CORS preflight honours the exact-origin policy", async () => {
  await withServer({ storage: { bucket: () => ({}) } }, async (base) => {
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.equal(health.headers.get("cache-control"), "no-store");
    const body = await health.json();
    assert.deepEqual(Object.keys(body).sort(), ["status", "timestamp"]);
    assert.equal(body.status, "healthy");

    const allowed = await fetch(`${base}/api/health`, {
      method: "OPTIONS",
      headers: { Origin: "https://aula-c-jorge.web.app" },
    });
    assert.equal(allowed.status, 204);
    assert.equal(allowed.headers.get("access-control-allow-origin"), "https://aula-c-jorge.web.app");
    assert.equal(allowed.headers.get("vary"), "Origin");

    const preview = await fetch(`${base}/api/health`, {
      method: "OPTIONS",
      headers: { Origin: "https://aula-c-jorge--pr1-abc123.web.app" },
    });
    assert.equal(preview.status, 403);
    assert.equal(preview.headers.get("access-control-allow-origin"), null);
    const evil = await fetch(`${base}/api/health`, { headers: { Origin: "https://evil.example" } });
    assert.equal(evil.status, 403);
  });
});

test("the test network guard blocks non-loopback destinations without opening a connection", async () => {
  await assert.rejects(() => fetch("https://example.com/"), /Test network guard/);
  await assert.rejects(() => fetch("http://192.0.2.1:9/"), /Test network guard/);
});
