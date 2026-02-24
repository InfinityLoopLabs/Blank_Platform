import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveVariables } from "./replace-utils";
import type { PasteCommandStep, VariableMap } from "./types";

export async function runPasteCommand(
  step: PasteCommandStep,
  cwd: string,
  variables: VariableMap,
): Promise<void> {
  const targetPath = path.resolve(cwd, resolveVariables(step.to, variables));
  const nextContent = resolveVariables(step.content, variables);
  const mode = step.mode ?? "append";
  await mkdir(path.dirname(targetPath), { recursive: true });

  let existing = "";
  if (existsSync(targetPath)) {
    existing = await readFile(targetPath, "utf8");
  }

  if (mode === "replace") {
    await writeFile(targetPath, nextContent, "utf8");
    return;
  }

  if (mode === "prepend") {
    await writeFile(targetPath, `${nextContent}${existing}`, "utf8");
    return;
  }

  await writeFile(targetPath, `${existing}${nextContent}`, "utf8");
}
