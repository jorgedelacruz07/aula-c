// Fail-fast outbound network guard for the test suite: only loopback destinations are allowed.
// Loaded with `node --import ./scripts/test-network-guard.mjs --test ...` (see package.json "test").
import net from "node:net";
import { normalizeLoopbackHostname } from "../api/security-baseline.mjs";

if (!globalThis.__aulaNetworkGuard) {
  globalThis.__aulaNetworkGuard = true;
  const allowed = (host) => !host || normalizeLoopbackHostname(String(host)) !== null;
  const block = (target) =>
    new Error(`Test network guard: outbound connection to ${target} blocked (loopback only).`);

  const realFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
    if (!allowed(url.hostname.replace(/^\[|\]$/g, ""))) return Promise.reject(block(url.hostname));
    return realFetch(input, init);
  };

  const realConnect = net.Socket.prototype.connect;
  net.Socket.prototype.connect = function connect(...args) {
    const [first, second] = args;
    let host;
    if (first && typeof first === "object" && !Array.isArray(first)) {
      if (first.path) return realConnect.apply(this, args);
      host = first.host;
    } else if (typeof first === "string" && Number.isNaN(Number(first))) {
      return realConnect.apply(this, args); // unix socket path
    } else if (typeof second === "string") {
      host = second;
    }
    if (!allowed(host)) {
      const error = block(host);
      queueMicrotask(() => this.destroy(error));
      return this;
    }
    return realConnect.apply(this, args);
  };
}
