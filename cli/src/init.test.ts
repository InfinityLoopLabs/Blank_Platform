import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createInitConfigFile } from "./init";

test("init creates infinityloop config file with repo and ref", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-init-"));

  try {
    const result = await createInitConfigFile({
      cwd: root,
      repo: "acme/template",
      ref: "develop",
    });

    assert.equal(result.configPath, path.join(root, "infinityloop.config.js"));
    const content = await readFile(result.configPath, "utf8");
    assert.match(content, /type: "download"/);
    assert.match(content, /repo: "acme\/template"/);
    assert.match(content, /ref: "develop"/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("init fails when file already exists without --force", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-init-exists-"));

  try {
    const configPath = path.join(root, "infinityloop.config.js");
    await writeFile(configPath, "module.exports = {}", "utf8");

    await assert.rejects(
      createInitConfigFile({
        cwd: root,
      }),
      /already exists/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("init overwrites existing file with --force", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-init-force-"));

  try {
    const configPath = path.join(root, "infinityloop.config.js");
    await writeFile(configPath, "module.exports = {}", "utf8");

    await createInitConfigFile({
      cwd: root,
      force: true,
      repo: "owner/repo",
      ref: "main",
    });

    const content = await readFile(configPath, "utf8");
    assert.match(content, /bootstrap/);
    assert.match(content, /repo: "owner\/repo"/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
