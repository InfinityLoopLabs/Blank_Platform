import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { addPlugin } from "./index";

test("add plugin preserves case in replacements", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ill-add-"));

  try {
    const sourceDir = path.join(root, "template");
    await mkdir(sourceDir, { recursive: true });
    await writeFile(path.join(sourceDir, "Sample.txt"), "Sample sample SAMPLE", "utf8");

    const payload = addPlugin.parse(
      {
        type: "add",
        from: "template",
        to: "target/$name",
        replace: [{ Sample: "$name" }, { sample: "$name" }],
      },
      {
        configPath: "infinityloop.config.js",
        commandKey: "createWidget",
        stepIndex: 0,
      },
    );

    await addPlugin.execute(payload, {
      cwd: root,
      variables: { name: "Popup" },
    });

    const content = await readFile(path.join(root, "target", "Popup", "Popup.txt"), "utf8");
    assert.equal(content, "Popup popup POPUP");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
