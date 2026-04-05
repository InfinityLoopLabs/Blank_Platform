import path from "node:path";
import { parseArgs } from "./args";
import { loadProjectConfig } from "./config";
import { createInitConfigFile } from "./init";
import { runCommandByKey } from "./runtime";
import type { Variables } from "./types";
import { builtinPlugins } from "./plugins";

export * from "./types";
export * from "./args";
export * from "./config";
export * from "./init";
export * from "./runtime";
export * from "./plugins";
export * from "./plugins/add";
export * from "./plugins/download";
export * from "./plugins/insert";
export * from "./plugins/merge-template";
export * from "./plugins/remove-line";
export * from "./plugins/remove";

export async function runCli(args: string[]): Promise<number> {
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: ill <commandKey> [--name <value>] [--config <path>] [--cwd <path>]");
    console.log(
      "Init:  ill init [--repo <owner/repo|url>] [--target-repo <owner/repo|url>] [--ref <branch|tag>] [--force]",
    );
    console.log("Auto config names: infinityloop.config.js|mjs|cjs");
    console.log("Example: ill createWidget --name=Popup");
    return 0;
  }

  try {
    const options = parseArgs(args);
    if (options.commandKey === "init") {
      const { configPath } = await createInitConfigFile({
        cwd: options.cwd,
        repo: options.repo,
        targetRepo: options.targetRepo,
        ref: options.ref,
        force: options.force,
      });
      console.log(`Created config: ${path.relative(options.cwd, configPath)}`);
      return 0;
    }

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
