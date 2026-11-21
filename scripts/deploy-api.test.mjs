import test from "node:test";
import assert from "node:assert/strict";
import {
  assertCleanTree,
  buildCleanupPolicyArgs,
  buildDeployArgs,
  checkZeroCostInvariants,
  config,
  deployApi,
  parseFlags,
} from "./deploy-api.mjs";

const SHA = "a".repeat(40);
const DIGEST = `sha256:${"b".repeat(64)}`;
const IMAGE_REF = `${config.image}@${DIGEST}`;

function fakeExec({ dirty = false, previous = true } = {}) {
  const calls = [];
  const exec = (command, args) => {
    calls.push([command, ...args]);
    const line = `${command} ${args.join(" ")}`;
    if (line === "git status --porcelain") return { status: 0, stdout: dirty ? " M x\n" : "", stderr: "" };
    if (line === "git rev-parse HEAD") return { status: 0, stdout: `${SHA}\n`, stderr: "" };
    if (line.startsWith("gcloud artifacts docker images describe"))
      return { status: 0, stdout: `${DIGEST}\n`, stderr: "" };
    if (line.includes("--format=value(metadata.name)"))
      return { status: previous ? 0 : 1, stdout: "", stderr: "" };
    if (line.startsWith("gcloud run services describe")) {
      return {
        status: 0,
        stderr: "",
        stdout: JSON.stringify({
          status: {
            url: "https://aula-c-docs-api-x.a.run.app",
            latestCreatedRevisionName: "aula-c-docs-api-00099-abc",
            traffic: [
              { tag: "candidate", url: "https://candidate---aula-c-docs-api-x.a.run.app", percent: 0 },
            ],
          },
          spec: {
            template: {
              metadata: {
                annotations: {
                  "autoscaling.knative.dev/minScale": "0",
                  "autoscaling.knative.dev/maxScale": "1",
                  "run.googleapis.com/cpu-throttling": "true",
                },
              },
            },
          },
        }),
      };
    }
    return { status: 0, stdout: "", stderr: "" };
  };
  return { exec, calls };
}

test("deploy refuses a dirty tree and never reaches docker or gcloud", async () => {
  const { exec, calls } = fakeExec({ dirty: true });
  await assert.rejects(
    () => deployApi({ exec, fetchImpl: async () => ({ status: 200 }), log: () => {} }),
    /sucio/,
  );
  assert.deepEqual(
    calls.map((c) => c[0]),
    ["git"],
  );
  assert.throws(() => assertCleanTree(() => ({ status: 0, stdout: " M a", stderr: "" })), /sucio/);
});

test("Cloud Run args use the digest, a no-traffic candidate and zero-cost flags", () => {
  const args = buildDeployArgs({ imageRef: IMAGE_REF, commitSha: SHA, hasPreviousRevision: true });
  for (const expected of [
    `--image=${IMAGE_REF}`,
    "--no-traffic",
    "--tag=candidate",
    "--min-instances=0",
    "--max-instances=1",
    "--cpu-throttling",
    "--no-cpu-boost",
    "--concurrency=1",
  ]) {
    assert.ok(args.includes(expected), expected);
  }
  assert.ok(
    !buildDeployArgs({ imageRef: IMAGE_REF, commitSha: SHA, hasPreviousRevision: false }).includes(
      "--no-traffic",
    ),
  );
  assert.throws(
    () => buildDeployArgs({ imageRef: `${config.image}:latest`, commitSha: SHA, hasPreviousRevision: true }),
    /digest inmutable/,
  );
});

test("AR cleanup policy is dry-run unless explicitly applied", () => {
  assert.ok(buildCleanupPolicyArgs({ apply: false }).includes("--dry-run"));
  assert.ok(!buildCleanupPolicyArgs({ apply: false }).includes("--no-dry-run"));
  assert.ok(buildCleanupPolicyArgs({ apply: true }).includes("--no-dry-run"));
  assert.deepEqual(parseFlags([]), { syncSecret: false, applyArPolicy: false });
  assert.deepEqual(parseFlags(["--apply-ar-policy"]), { syncSecret: false, applyArPolicy: true });
  assert.throws(() => parseFlags(["--force"]), /no reconocidos/);
});

test("successful deploy: clean tree, tag from SHA, digest deploy, probe before traffic shift", async () => {
  const { exec, calls } = fakeExec();
  const probed = [];
  const result = await deployApi({
    exec,
    log: () => {},
    fetchImpl: async (url) => {
      probed.push({ url, atCall: calls.length });
      return { status: 200 };
    },
  });
  const lines = calls.map((c) => c.join(" "));
  const build = lines.find((l) => l.startsWith("docker buildx build"));
  assert.ok(build.includes(`${config.image}:${SHA.slice(0, 12)}`));
  assert.ok(!lines.some((l) => l.includes("-dirty")));
  const deploy = lines.find((l) => l.startsWith("gcloud run deploy"));
  assert.ok(deploy.includes(`--image=${IMAGE_REF}`) && deploy.includes("--no-traffic"));
  const shift = lines.findIndex((l) => l.includes("update-traffic"));
  assert.ok(shift > lines.findIndex((l) => l.startsWith("gcloud run deploy")));
  assert.equal(probed[0].url, "https://candidate---aula-c-docs-api-x.a.run.app/api/health");
  assert.ok(probed[0].atCall <= shift, "probe happens before the traffic shift");
  assert.ok(lines.some((l) => l.includes("set-cleanup-policies") && l.includes("--dry-run")));
  assert.ok(!lines.some((l) => l.includes("--no-dry-run") || l.includes("secrets versions add")));
  assert.equal(result.revision, "aula-c-docs-api-00099-abc");
});

test("a failing candidate probe leaves traffic untouched", async () => {
  const { exec, calls } = fakeExec();
  await assert.rejects(
    () => deployApi({ exec, log: () => {}, fetchImpl: async () => ({ status: 503 }) }),
    /falló el health/,
  );
  assert.ok(!calls.some((c) => c.includes("update-traffic")));
});

test("zero-cost invariants reject a drifted live service", () => {
  const service = (annotations) => ({ spec: { template: { metadata: { annotations } } } });
  const ok = {
    "autoscaling.knative.dev/minScale": "0",
    "autoscaling.knative.dev/maxScale": "1",
    "run.googleapis.com/cpu-throttling": "true",
  };
  checkZeroCostInvariants(service(ok));
  assert.throws(
    () => checkZeroCostInvariants(service({ ...ok, "autoscaling.knative.dev/minScale": "1" })),
    /minScale/,
  );
  assert.throws(
    () => checkZeroCostInvariants(service({ ...ok, "run.googleapis.com/cpu-throttling": "false" })),
    /throttling/,
  );
  assert.throws(
    () => checkZeroCostInvariants(service({ ...ok, "autoscaling.knative.dev/maxScale": "5" })),
    /maxScale/,
  );
});
