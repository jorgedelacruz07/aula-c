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
  parsePushDigest,
} from "./deploy-api.mjs";

const SHA = "a".repeat(40);
const DIGEST = `sha256:${"b".repeat(64)}`;
const IMAGE_REF = `${config.image}@${DIGEST}`;

function fakeExec({
  dirty = false,
  previous = true,
  pushOutput = `latest: digest: ${DIGEST} size: 1234\n`,
  registryDigest = DIGEST,
  registryOk = true,
} = {}) {
  const calls = [];
  const exec = (command, args) => {
    calls.push([command, ...args]);
    const line = `${command} ${args.join(" ")}`;
    if (line === "git status --porcelain") return { status: 0, stdout: dirty ? " M x\n" : "", stderr: "" };
    if (line === "git rev-parse HEAD") return { status: 0, stdout: `${SHA}\n`, stderr: "" };
    if (line.startsWith("docker push")) return { status: 0, stdout: pushOutput, stderr: "" };
    if (line.startsWith("gcloud artifacts docker images describe"))
      return { status: registryOk ? 0 : 1, stdout: `${registryDigest}\n`, stderr: "" };
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
  const args = buildDeployArgs({ imageRef: IMAGE_REF, commitSha: SHA });
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
  assert.throws(
    () => buildDeployArgs({ imageRef: `${config.image}:latest`, commitSha: SHA }),
    /digest inmutable/,
  );
});

test("AR cleanup policy is dry-run unless explicitly applied", () => {
  assert.ok(buildCleanupPolicyArgs({ apply: false }).includes("--dry-run"));
  assert.ok(!buildCleanupPolicyArgs({ apply: false }).includes("--no-dry-run"));
  assert.ok(buildCleanupPolicyArgs({ apply: true }).includes("--no-dry-run"));
  assert.deepEqual(parseFlags([]), { syncSecret: false, applyArPolicy: false, firstDeploy: false });
  assert.deepEqual(parseFlags(["--apply-ar-policy", "--first-deploy"]), {
    syncSecret: false,
    applyArPolicy: true,
    firstDeploy: true,
  });
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
  assert.ok(build.includes("--load") && !build.includes("--push"));
  assert.ok(lines.indexOf(`docker push ${config.image}:${SHA.slice(0, 12)}`) > lines.indexOf(build));
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

test("parsePushDigest reads the digest reported by docker push", () => {
  assert.equal(parsePushDigest(`1a2b: Pushed\n${SHA.slice(0, 12)}: digest: ${DIGEST} size: 1234\n`), DIGEST);
  assert.equal(parsePushDigest("no digest here"), "");
  assert.equal(parsePushDigest("digest: sha256:short size: 1"), "");
});

test("digest mismatch between docker push and Artifact Registry aborts before Cloud Run", async () => {
  const other = `sha256:${"c".repeat(64)}`;
  const { exec, calls } = fakeExec({ registryDigest: other });
  await assert.rejects(
    () => deployApi({ exec, log: () => {}, fetchImpl: async () => ({ status: 200 }) }),
    /no coincide/,
  );
  assert.ok(!calls.some((c) => c[0] === "gcloud" && c[1] === "run" && c[2] === "deploy"));
});

test("missing push digest or unverifiable registry digest aborts before Cloud Run", async () => {
  for (const options of [{ pushOutput: "Pushed\n" }, { registryOk: false }]) {
    const { exec, calls } = fakeExec(options);
    await assert.rejects(() => deployApi({ exec, log: () => {}, fetchImpl: async () => ({ status: 200 }) }));
    assert.ok(!calls.some((c) => c[0] === "gcloud" && c[1] === "run" && c[2] === "deploy"));
  }
});

test("first deploy (no serving revision) is refused before building unless --first-deploy", async () => {
  const refused = fakeExec({ previous: false });
  await assert.rejects(
    () => deployApi({ exec: refused.exec, log: () => {}, fetchImpl: async () => ({ status: 200 }) }),
    /--first-deploy/,
  );
  assert.ok(!refused.calls.some((c) => c[0] === "docker"));

  const accepted = fakeExec({ previous: false });
  const probed = [];
  await deployApi({
    exec: accepted.exec,
    flags: { firstDeploy: true },
    log: () => {},
    fetchImpl: async (url) => {
      probed.push(url);
      return { status: 200 };
    },
  });
  const lines = accepted.calls.map((c) => c.join(" "));
  const deploy = lines.find((l) => l.startsWith("gcloud run deploy"));
  assert.ok(deploy.includes("--no-traffic") && deploy.includes("--tag=candidate"));
  assert.equal(probed.length, 1);
  assert.ok(lines.findIndex((l) => l.includes("update-traffic")) > lines.indexOf(deploy));
});
