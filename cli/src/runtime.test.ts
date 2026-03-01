import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { builtinPlugins } from "./plugins";
import { runCommandByKey } from "./runtime";

test("runtime executes command steps sequentially", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-runtime-"));

  try {
    const hooksFile = path.join(root, "result", "Popup", "hooks.ts");
    const config = {
      commands: {
        patchHooks: [
          {
            type: "insert",
            file: "result/$name/hooks.ts",
            placeholder: "// Insert Hooks here",
            line: "createAppActions($name)",
          },
          {
            type: "remove-line",
            file: "result/$name/hooks.ts",
            line: "createAppActions($name)",
          },
        ],
      },
    };

    await mkdir(path.dirname(hooksFile), { recursive: true });
    await writeFile(hooksFile, "// Insert Hooks here", "utf8");

    const stepsCount = await runCommandByKey(
      config,
      "patchHooks",
      root,
      { name: "Popup" },
      builtinPlugins,
      "infinityloop.config.js",
    );

    assert.equal(stepsCount, 2);
    const content = await readFile(hooksFile, "utf8");
    assert.equal(content, "// Insert Hooks here");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
