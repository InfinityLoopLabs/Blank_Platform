import path from "node:path";
import { parseArgs } from "./args/parse-args";
import { runCommandSteps } from "./commands/run-command-steps";
import { resolveCommandSteps } from "./commands/resolve-command-steps";
import { loadConfig } from "./config/load-config";
import type { VariableMap } from "./commands/types";

export * from "./args/parse-args";
export * from "./commands/types";
export * from "./commands/run-command-steps";
export * from "./commands/resolve-command-steps";
export * from "./config/config-types";
export * from "./config/find-config-path";
export * from "./config/load-config";
export * from "./parse-commands/parse-commands-map";
export * from "./parse-commands/normalize-command-step";
export * from "./parse-commands/normalize-replace-rules";

export async function runCli(args: string[]): Promise<number> {
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: ill <commandKey> [--name <value>] [--config <path>] [--cwd <path>]");
    console.log("Auto config names: infinityloop.config.js|mjs|cjs");
    console.log("Example: ill createWidget --name=Popup");
    return 0;
  }

  try {
    const options = parseArgs(args);
    const { config, configPath } = await loadConfig(options.cwd, options.configPath);
    const steps = resolveCommandSteps(config.commands ?? {}, options.commandKey);
    const variables: VariableMap = {
      name: options.name,
    };

    await runCommandSteps(steps, options.cwd, variables);

    if (configPath) {
      console.log(`Loaded config: ${path.relative(options.cwd, configPath)}`);
    }
    console.log(`Command: ${options.commandKey}`);
    console.log(`Steps executed: ${steps.length}`);

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`CLI error: ${message}`);
    return 1;
  }
}
