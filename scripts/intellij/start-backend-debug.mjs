import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const exampleEnvFile = "docker/.env.dev.example";
const localEnvFile = "docker/.env.dev";
const envFiles = [exampleEnvFile];

if (existsSync(resolve(projectRoot, localEnvFile))) envFiles.push(localEnvFile);
const inspectorUrl = "http://127.0.0.1:9229/json/list";
const timeoutMs = 90_000;

function startCompose() {
  const result = spawnSync(
    "docker",
    [
      "compose",
      ...envFiles.flatMap((envFile) => ["--env-file", envFile]),
      "-f",
      "docker-compose.yml",
      "up",
      "--build",
      "--detach",
      "app",
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
    },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function waitForInspector() {
  const deadline = Date.now() + timeoutMs;
  process.stdout.write("Waiting for Next.js Node Inspector on 127.0.0.1:9229…\n");

  while (Date.now() < deadline) {
    try {
      const response = await fetch(inspectorUrl, { signal: AbortSignal.timeout(1_000) });
      const targets = await response.json();

      if (
        response.ok &&
        Array.isArray(targets) &&
        targets.some((target) => target?.type === "node")
      ) {
        process.stdout.write("Node Inspector is ready. IntelliJ will now attach.\n");
        return;
      }
    } catch {
      // Compose may still be waiting for MySQL, Redis, or the migration service.
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }

  throw new Error(
    `Node Inspector did not become ready within ${timeoutMs / 1_000} seconds. Run: docker compose --env-file ${exampleEnvFile} -f docker-compose.yml logs app`,
  );
}

try {
  startCompose();
  await waitForInspector();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
