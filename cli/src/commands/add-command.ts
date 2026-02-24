import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { applyReplaceRules, resolveVariables } from "./replace-utils";
import type { AddCommandStep, ReplaceRule, VariableMap } from "./types";

function isLikelyTextFile(buffer: Buffer): boolean {
  const sizeToCheck = Math.min(buffer.length, 4000);
  for (let i = 0; i < sizeToCheck; i += 1) {
    if (buffer[i] === 0) {
      return false;
    }
  }
  return true;
}

async function copyWithTransforms(
  sourceDir: string,
  targetDir: string,
  replaceRules: ReplaceRule[],
  variables: VariableMap,
): Promise<void> {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const transformedName = applyReplaceRules(entry.name, replaceRules, variables);
    const targetPath = path.join(targetDir, transformedName);

    if (entry.isDirectory()) {
      await copyWithTransforms(sourcePath, targetPath, replaceRules, variables);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const fileBuffer = await readFile(sourcePath);
    if (isLikelyTextFile(fileBuffer)) {
      const transformedContent = applyReplaceRules(fileBuffer.toString("utf8"), replaceRules, variables);
      await writeFile(targetPath, transformedContent, "utf8");
      continue;
    }

    await writeFile(targetPath, fileBuffer);
  }
}

export async function runAddCommand(
  step: AddCommandStep,
  cwd: string,
  variables: VariableMap,
): Promise<void> {
  const sourcePath = path.resolve(cwd, resolveVariables(step.from, variables));
  const targetPath = path.resolve(cwd, resolveVariables(step.to, variables));

  if (!existsSync(sourcePath)) {
    throw new Error(`Add source path does not exist: ${sourcePath}`);
  }

  const replaceRules = step.replace ?? [];
  const transformedTargetPath = applyReplaceRules(targetPath, replaceRules, variables);
  await copyWithTransforms(sourcePath, transformedTargetPath, replaceRules, variables);
}
