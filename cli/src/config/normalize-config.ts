import type { InfinityloopConfig } from "./config-types";
import { parseCommandsMap } from "../parse-commands/parse-commands-map";
import { isPlainObject } from "../shared/is-plain-object";

export function normalizeConfig(rawConfig: unknown, configPath: string): InfinityloopConfig {
  if (rawConfig === null || rawConfig === undefined) {
    return {};
  }

  if (!isPlainObject(rawConfig)) {
    throw new Error(`Config "${configPath}" must export an object.`);
  }

  const normalized: InfinityloopConfig = {};
  if (rawConfig.commands !== undefined) {
    normalized.commands = parseCommandsMap(rawConfig.commands, configPath);
  }

  return normalized;
}
