import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_NAME = "world";

export const CONFIG_FILE_NAMES = [
  "infinityloop.config.js",
  "infinityloop.config.mjs",
  "infinityloop.config.cjs",
] as const;

export type InfinityloopConfig = {
  name?: string;
};

export type CliOptions = {
  cwd: string;
  configPath?: string;
  name?: string;
};

export type LoadedConfig = {
  config: InfinityloopConfig;
  configPath?: string;
};

const runtimeImport = (modulePath: string): Promise<unknown> => {
  const importer = new Function("modulePath", "return import(modulePath);") as (
    pathValue: string,
  ) => Promise<unknown>;

  return importer(modulePath);
};

export function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    cwd: process.cwd(),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const nextArg = args[i + 1];

    if ((arg === "--name" || arg === "-n") && nextArg !== undefined) {
      options.name = nextArg;
      i += 1;
      continue;
    }

    if ((arg === "--config" || arg === "-c") && nextArg !== undefined) {
      options.configPath = nextArg;
      i += 1;
      continue;
    }

    if (arg === "--cwd" && nextArg !== undefined) {
      options.cwd = path.resolve(nextArg);
      i += 1;
    }
  }

  return options;
}

export function findConfigPath(cwd: string): string | undefined {
  for (const configName of CONFIG_FILE_NAMES) {
    const absolutePath = path.resolve(cwd, configName);
    if (existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  return undefined;
}

function normalizeConfig(rawConfig: unknown, configPath: string): InfinityloopConfig {
  if (rawConfig === null || rawConfig === undefined) {
    return {};
  }

  if (typeof rawConfig !== "object" || Array.isArray(rawConfig)) {
    throw new Error(`Config "${configPath}" must export an object.`);
  }

  const config = rawConfig as Record<string, unknown>;
  const normalized: InfinityloopConfig = {};

  if (config.name !== undefined) {
    if (typeof config.name !== "string") {
      throw new Error(`Config "${configPath}" field "name" must be a string.`);
    }
    normalized.name = config.name;
  }

  return normalized;
}

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

export function buildGreeting(name: string): string {
  return `Hello, ${name}!`;
}

export async function runCli(args: string[]): Promise<number> {
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: infinity-cli [--name <value>] [--config <path>] [--cwd <path>]");
    console.log("Auto config names: infinityloop.config.js|mjs|cjs");
    console.log("Example: infinity-cli --name Max");
    return 0;
  }

  try {
    const options = parseArgs(args);
    const { config, configPath } = await loadConfig(options.cwd, options.configPath);
    const name = options.name ?? config.name ?? DEFAULT_NAME;

    if (configPath) {
      console.log(`Loaded config: ${path.relative(options.cwd, configPath)}`);
    }

    console.log(buildGreeting(name));

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`CLI error: ${message}`);
    return 1;
  }
}
