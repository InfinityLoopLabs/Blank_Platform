import { rm } from "node:fs/promises";
import path from "node:path";
import { resolveVariables } from "./replace-utils";
import type { RemoveCommandStep, VariableMap } from "./types";

export async function runRemoveCommand(
  step: RemoveCommandStep,
  cwd: string,
  variables: VariableMap,
): Promise<void> {
  const targetPath = path.resolve(cwd, resolveVariables(step.target, variables));
  await rm(targetPath, { recursive: true, force: true });
}
