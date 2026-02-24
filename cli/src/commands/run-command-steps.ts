import { runAddCommand } from "./add-command";
import { runPasteCommand } from "./paste-command";
import { runRemoveCommand } from "./remove-command";
import type { CommandStep, VariableMap } from "./types";

export async function runCommandSteps(
  steps: CommandStep[],
  cwd: string,
  variables: VariableMap,
): Promise<void> {
  for (const step of steps) {
    if (step.type === "add") {
      await runAddCommand(step, cwd, variables);
      continue;
    }

    if (step.type === "paste") {
      await runPasteCommand(step, cwd, variables);
      continue;
    }

    await runRemoveCommand(step, cwd, variables);
  }
}
