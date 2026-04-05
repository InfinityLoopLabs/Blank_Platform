import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { downloadPlugin } from "./index";

const execFileAsync = promisify(execFile);

async function runGit(args: string[], cwd: string): Promise<void> {
  await execFileAsync("git", args, { cwd });
}

test("download plugin clones template and removes git-related files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-download-"));

  try {
    const sourceRepo = path.join(root, "source");
    const targetDir = path.join(root, "target");

    await mkdir(path.join(sourceRepo, ".github", "workflows"), { recursive: true });
    await mkdir(path.join(sourceRepo, "src"), { recursive: true });
    await writeFile(path.join(sourceRepo, "README.md"), "# Template", "utf8");
    await writeFile(path.join(sourceRepo, ".gitignore"), "node_modules\n", "utf8");
    await writeFile(path.join(sourceRepo, ".github", "workflows", "ci.yml"), "name: ci", "utf8");
    await writeFile(path.join(sourceRepo, "src", "index.ts"), "export const value = 1;\n", "utf8");

    await runGit(["init"], sourceRepo);
    await runGit(["config", "user.name", "ILL Test"], sourceRepo);
    await runGit(["config", "user.email", "ill-test@example.com"], sourceRepo);
    await runGit(["add", "."], sourceRepo);
    await runGit(["commit", "-m", "init"], sourceRepo);

    await mkdir(targetDir, { recursive: true });

    const payload = downloadPlugin.parse(
      {
        type: "download",
        repo: sourceRepo,
      },
      {
        configPath: "infinityloop.config.js",
        commandKey: "bootstrap",
        stepIndex: 0,
      },
    );

    await downloadPlugin.execute(payload, {
      cwd: targetDir,
      variables: {},
    });

    const readme = await readFile(path.join(targetDir, "README.md"), "utf8");
    assert.equal(readme, "# Template");

    const source = await readFile(path.join(targetDir, "src", "index.ts"), "utf8");
    assert.equal(source, "export const value = 1;\n");

    await assert.rejects(readFile(path.join(targetDir, ".gitignore"), "utf8"));
    await assert.rejects(readFile(path.join(targetDir, ".git", "HEAD"), "utf8"));
    await assert.rejects(readFile(path.join(targetDir, ".github", "workflows", "ci.yml"), "utf8"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("download plugin fails on non-empty target without allowNonEmpty", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-download-non-empty-"));

  try {
    const targetDir = path.join(root, "target");
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "existing.txt"), "keep", "utf8");

    const payload = downloadPlugin.parse(
      {
        type: "download",
        repo: "owner/repo",
      },
      {
        configPath: "infinityloop.config.js",
        commandKey: "bootstrap",
        stepIndex: 0,
      },
    );

    await assert.rejects(
      downloadPlugin.execute(payload, {
        cwd: targetDir,
        variables: {},
      }),
      /must be empty/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
