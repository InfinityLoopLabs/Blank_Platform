import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isPlainObject } from "./shared/is-plain-object";
import type { CommandStepRaw, LoadedProjectConfig, ProjectConfig } from "./types";

export const CONFIG_FILE_NAMES = [
  "infinityloop.config.js",
  "infinityloop.config.mjs",
  "infinityloop.config.cjs",
] as const;

const runtimeImport = (modulePath: string): Promise<unknown> => {
  const importer = new Function("modulePath", "return import(modulePath);") as (
    pathValue: string,
  ) => Promise<unknown>;
  return importer(modulePath);
};

export function findConfigPath(cwd: string): string | undefined {
  for (const configName of CONFIG_FILE_NAMES) {
    const absolutePath = path.resolve(cwd, configName);
    if (existsSync(absolutePath)) {
      return absolutePath;
    }
  }
  return undefined;
}

function normalizeConfig(rawConfig: unknown, configPath: string): ProjectConfig {
  if (rawConfig === null || rawConfig === undefined) {
    return {};
  }

  if (!isPlainObject(rawConfig)) {
    throw new Error(`Config "${configPath}" must export an object.`);
  }

  const normalized: ProjectConfig = {};
  if (rawConfig.commands !== undefined) {
    if (!isPlainObject(rawConfig.commands)) {
      throw new Error(`Config "${configPath}" field "commands" must be an object.`);
    }

    const commands: Record<string, CommandStepRaw[]> = {};
    for (const [commandKey, rawSteps] of Object.entries(rawConfig.commands)) {
      if (!Array.isArray(rawSteps)) {
        throw new Error(`Config "${configPath}" commands["${commandKey}"] must be an array.`);
      }

      commands[commandKey] = rawSteps.map((step, stepIndex) => {
        if (!isPlainObject(step)) {
          throw new Error(`Config "${configPath}" commands["${commandKey}"][${stepIndex}] must be an object.`);
        }
        if (typeof step.type !== "string") {
          throw new Error(
            `Config "${configPath}" commands["${commandKey}"][${stepIndex}] must include string field "type".`,
          );
        }
        return step as CommandStepRaw;
      });
    }

    normalized.commands = commands;
  }

  return normalized;
}

export async function loadProjectConfig(
  cwd: string,
  explicitConfigPath?: string,
): Promise<LoadedProjectConfig> {
  const configPath = explicitConfigPath
    ? path.resolve(cwd, explicitConfigPath)
    : findConfigPath(cwd);

  if (!configPath) {
    return { config: {} };
  }

  const moduleUrl = pathToFileURL(configPath).href;
  const importedModule = (await runtimeImport(moduleUrl)) as Record<string, unknown>;
  const rawConfig = importedModule.default ?? importedModule;
  const config = normalizeConfig(rawConfig, configPath);

  return { config, configPath };
}
