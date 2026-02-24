import type { CommandStep } from "./types";

export function resolveCommandSteps(
  commands: Record<string, CommandStep[]>,
  commandKey: string | undefined,
): CommandStep[] {
  if (!commandKey) {
    throw new Error("Command key is required. Usage: ill <commandKey> --name=<value>.");
  }

  const steps = commands[commandKey];
  if (steps === undefined) {
    const availableKeys = Object.keys(commands).sort();
    const keysText = availableKeys.length > 0 ? availableKeys.join(", ") : "<empty>";
    throw new Error(`Unknown command key "${commandKey}". Available keys: ${keysText}.`);
  }

  return steps;
}
