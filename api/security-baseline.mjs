// Vendored from the shared platform security baseline (meta-repo tools/security-baseline/).
// Zero dependencies. Keep behaviour in sync; do not import across repositories.
import { isIPv4 } from "node:net";

/** Resolve the explicit runtime mode. K_SERVICE (Cloud Run) is always production; anything unknown fails closed. */
export function resolveRuntimeMode(env = process.env) {
  const nodeEnv = env.NODE_ENV?.trim();
  const cloudRun = Boolean(env.K_SERVICE?.trim());
  if (cloudRun) {
    if (nodeEnv && nodeEnv !== "production") {
      throw new Error(
        `Invalid runtime configuration: K_SERVICE cannot be combined with NODE_ENV=${nodeEnv}.`,
      );
    }
    return "production";
  }
  if (nodeEnv === "development" || nodeEnv === "test" || nodeEnv === "production") return nodeEnv;
  throw new Error(
    `Invalid runtime configuration: set NODE_ENV to development, test, or production${nodeEnv ? ` (received ${nodeEnv})` : ""}.`,
  );
}

/** Return the normalized host only for `localhost`, `::1` or a valid IPv4 literal in 127.0.0.0/8. */
export function normalizeLoopbackHostname(hostname) {
  if (typeof hostname !== "string") return null;
  const host = hostname.trim().toLowerCase();
  if (!host) return null;
  if (host === "localhost" || host === "::1") return host;
  if (!isIPv4(host)) return null;
  return Number(host.split(".", 1)[0]) === 127 ? host : null;
}

/** Production binds 0.0.0.0 for Cloud Run ingress; development and test accept loopback only (default 127.0.0.1). */
export function resolveListenHostname(
  env = process.env,
  { hostEnvVar = "API_HOST", extraHostEnvVars = [] } = {},
) {
  const mode = resolveRuntimeMode(env);
  if (mode === "production") return "0.0.0.0";
  for (const key of [hostEnvVar, ...extraHostEnvVars].filter(Boolean)) {
    const requested = env[key]?.trim();
    if (!requested) continue;
    const loopback = normalizeLoopbackHostname(requested);
    if (!loopback) {
      throw new Error(`Unsafe ${mode} bind: ${key} must be a loopback IP literal or localhost.`);
    }
    return loopback;
  }
  return "127.0.0.1";
}

/** Exact HTTP(S) origin: no path, query, fragment, trailing slash, wildcard or credentials. */
export function isExactHttpOrigin(value) {
  if (typeof value !== "string" || !value) return false;
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.origin === value &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

/** Parse a comma-separated origin list; throws on any invalid entry. Empty/undefined returns []. */
export function parseConfiguredCorsOrigins(value) {
  if (value === undefined || value.trim() === "") return [];
  return value.split(",").map((entry) => {
    const origin = entry.trim();
    if (!isExactHttpOrigin(origin)) {
      throw new Error(
        `Invalid ALLOWED_ORIGINS entry: ${origin || "<empty>"}. Use comma-separated exact HTTP(S) origins without paths, credentials, or wildcards.`,
      );
    }
    return origin;
  });
}

const FIREBASE_PROJECT_ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/** Exact origins plus optional Firebase Hosting preview channels scoped to explicit project ids. */
export function createCorsOriginPolicy({ origins = [], firebaseProjectIds = [] } = {}) {
  for (const origin of origins) {
    if (!isExactHttpOrigin(origin)) throw new Error(`Invalid exact CORS origin in policy: ${String(origin)}`);
  }
  const exact = new Set(origins);
  const previews = firebaseProjectIds.map((id) => {
    if (typeof id !== "string" || !FIREBASE_PROJECT_ID_RE.test(id)) {
      throw new Error(`Invalid Firebase project ID for CORS preview scope: ${String(id)}`);
    }
    return new RegExp(`^${id}--[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.web\\.app$`);
  });
  return {
    isAllowedOrigin(origin) {
      if (!isExactHttpOrigin(origin)) return false;
      if (exact.has(origin)) return true;
      const parsed = new URL(origin);
      return parsed.protocol === "https:" && !parsed.port && previews.some((re) => re.test(parsed.hostname));
    },
  };
}

/** Liveness-only payload: no config readiness, memory, uptime or outbound diagnostics. */
export function createLivenessPayload({ now = () => new Date() } = {}) {
  return { status: "healthy", timestamp: now().toISOString() };
}
