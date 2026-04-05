import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { mergeTemplatePlugin } from "./index";

const execFileAsync = promisify(execFile);

async function runGit(args: string[], cwd: string): Promise<void> {
  await execFileAsync("git", args, { cwd });
}

async function getCurrentBranch(cwd: string): Promise<string> {
  const { stdout } = await execFileAsync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd });
  return stdout.trim();
}

test("merge-template pulls files from template repository", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-merge-template-"));

  try {
    const sourceRepo = path.join(root, "source");
    const targetRepo = path.join(root, "target");

    await mkdir(sourceRepo, { recursive: true });
    await writeFile(path.join(sourceRepo, "template.txt"), "from template\n", "utf8");
    await runGit(["init"], sourceRepo);
    await runGit(["config", "user.name", "ILL Test"], sourceRepo);
    await runGit(["config", "user.email", "ill-test@example.com"], sourceRepo);
    await runGit(["add", "."], sourceRepo);
    await runGit(["commit", "-m", "template init"], sourceRepo);
    const sourceBranch = await getCurrentBranch(sourceRepo);

    await mkdir(targetRepo, { recursive: true });
    await writeFile(path.join(targetRepo, "project.txt"), "from project\n", "utf8");
    await runGit(["init"], targetRepo);
    await runGit(["config", "user.name", "ILL Test"], targetRepo);
    await runGit(["config", "user.email", "ill-test@example.com"], targetRepo);
    await runGit(["add", "."], targetRepo);
    await runGit(["commit", "-m", "project init"], targetRepo);

    const payload = mergeTemplatePlugin.parse(
      {
        type: "merge-template",
        repo: sourceRepo,
        ref: sourceBranch,
      },
      {
        configPath: "infinityloop.config.js",
        commandKey: "syncTemplate",
        stepIndex: 0,
      },
    );

    await mergeTemplatePlugin.execute(payload, {
      cwd: targetRepo,
      variables: {},
    });

    const mergedFile = await readFile(path.join(targetRepo, "template.txt"), "utf8");
    assert.equal(mergedFile, "from template\n");

    const status = await execFileAsync("git", ["status", "--short"], { cwd: targetRepo });
    assert.match(status.stdout, /A  template\.txt/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("merge-template fails outside git repository", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-merge-template-no-git-"));

  try {
    const payload = mergeTemplatePlugin.parse(
      {
        type: "merge-template",
        repo: "owner/repo",
      },
      {
        configPath: "infinityloop.config.js",
        commandKey: "syncTemplate",
        stepIndex: 0,
      },
    );

    await assert.rejects(
      mergeTemplatePlugin.execute(payload, {
        cwd: root,
        variables: {},
      }),
      /not a git repository/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
