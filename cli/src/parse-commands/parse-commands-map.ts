import type { CommandStep } from "../commands/types";
import { isPlainObject } from "../shared/is-plain-object";
import { normalizeCommandStep } from "./normalize-command-step";

export function parseCommandsMap(
  rawCommands: unknown,
  configPath: string,
): Record<string, CommandStep[]> {
  if (!isPlainObject(rawCommands)) {
    throw new Error(`Config "${configPath}" field "commands" must be an object.`);
  }

  const normalizedCommands: Record<string, CommandStep[]> = {};
  for (const [commandKey, commandValue] of Object.entries(rawCommands)) {
    if (!Array.isArray(commandValue)) {
      throw new Error(`Config "${configPath}" commands["${commandKey}"] must be an array.`);
    }

    normalizedCommands[commandKey] = commandValue.map((step, index) =>
      normalizeCommandStep(step, configPath, commandKey, index),
    );
  }

  return normalizedCommands;
}
