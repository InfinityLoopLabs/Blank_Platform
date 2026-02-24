import path from "node:path";
import { pathToFileURL } from "node:url";
import type { LoadedConfig } from "./config-types";
import { findConfigPath } from "./find-config-path";
import { normalizeConfig } from "./normalize-config";

const runtimeImport = (modulePath: string): Promise<unknown> => {
  const importer = new Function("modulePath", "return import(modulePath);") as (
    pathValue: string,
  ) => Promise<unknown>;

  return importer(modulePath);
};

export async function loadConfig(cwd: string, explicitConfigPath?: string): Promise<LoadedConfig> {
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
