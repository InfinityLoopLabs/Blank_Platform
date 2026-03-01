import path from "node:path";
import { parseArgs } from "./args";
import { loadProjectConfig } from "./config";
import { runCommandByKey } from "./runtime";
import type { Variables } from "./types";
import { builtinPlugins } from "./plugins";

export * from "./types";
export * from "./args";
export * from "./config";
export * from "./runtime";
export * from "./plugins";
export * from "./plugins/add";
export * from "./plugins/insert";
export * from "./plugins/remove-line";
export * from "./plugins/remove";

export async function runCli(args: string[]): Promise<number> {
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: ill <commandKey> [--name <value>] [--config <path>] [--cwd <path>]");
    console.log("Auto config names: infinityloop.config.js|mjs|cjs");
    console.log("Example: ill createWidget --name=Popup");
    return 0;
  }

  try {
    const options = parseArgs(args);
    const { config, configPath } = await loadProjectConfig(options.cwd, options.configPath);
    const variables: Variables = {
      name: options.name,
    };

    const stepsCount = await runCommandByKey(
      config,
      options.commandKey,
      options.cwd,
      variables,
      builtinPlugins,
      configPath,
    );

    if (configPath) {
      console.log(`Loaded config: ${path.relative(options.cwd, configPath)}`);
    }
    console.log(`Command: ${options.commandKey}`);
    console.log(`Steps executed: ${stepsCount}`);

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`CLI error: ${message}`);
    return 1;
  }
}
