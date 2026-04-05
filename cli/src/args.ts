import path from "node:path";
import type { CliOptions } from "./types";

export function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = { cwd: process.cwd() };
  const positional: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const nextArg = args[i + 1];
    if (!arg) {
      continue;
    }

    if (arg.startsWith("--config=")) {
      options.configPath = arg.slice("--config=".length);
      continue;
    }

    if ((arg === "--config" || arg === "-c") && nextArg) {
      options.configPath = nextArg;
      i += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      options.cwd = path.resolve(arg.slice("--cwd=".length));
      continue;
    }

    if (arg === "--cwd" && nextArg) {
      options.cwd = path.resolve(nextArg);
      i += 1;
      continue;
    }

    if (arg.startsWith("--name=")) {
      options.name = arg.slice("--name=".length);
      continue;
    }

    if ((arg === "--name" || arg === "-n") && nextArg) {
      options.name = nextArg;
      i += 1;
      continue;
    }

    if (arg.startsWith("--repo=")) {
      options.repo = arg.slice("--repo=".length);
      continue;
    }

    if (arg === "--repo" && nextArg) {
      options.repo = nextArg;
      i += 1;
      continue;
    }

    if (arg.startsWith("--target-repo=")) {
      options.targetRepo = arg.slice("--target-repo=".length);
      continue;
    }

    if (arg === "--target-repo" && nextArg) {
      options.targetRepo = nextArg;
      i += 1;
      continue;
    }

    if (arg.startsWith("--ref=")) {
      options.ref = arg.slice("--ref=".length);
      continue;
    }

    if (arg === "--ref" && nextArg) {
      options.ref = nextArg;
      i += 1;
      continue;
    }

    if (arg === "--force" || arg === "-f") {
      options.force = true;
      continue;
    }

    if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }

  options.commandKey = positional[0];
  return options;
}
