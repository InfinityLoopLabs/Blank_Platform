import path from "node:path";

export type CliOptions = {
  cwd: string;
  configPath?: string;
  commandKey?: string;
  name?: string;
};

export function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    cwd: process.cwd(),
  };
  const positionalArgs: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const nextArg = args[i + 1];
    if (arg === undefined) {
      continue;
    }

    if (arg.startsWith("--config=")) {
      options.configPath = arg.slice("--config=".length);
      continue;
    }

    if ((arg === "--config" || arg === "-c") && nextArg !== undefined) {
      options.configPath = nextArg;
      i += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      options.cwd = path.resolve(arg.slice("--cwd=".length));
      continue;
    }

    if (arg === "--cwd" && nextArg !== undefined) {
      options.cwd = path.resolve(nextArg);
      i += 1;
      continue;
    }

    if (arg.startsWith("--name=")) {
      options.name = arg.slice("--name=".length);
      continue;
    }

    if ((arg === "--name" || arg === "-n") && nextArg !== undefined) {
      options.name = nextArg;
      i += 1;
      continue;
    }

    if (arg.startsWith("-")) {
      continue;
    }

    positionalArgs.push(arg);
  }

  options.commandKey = positionalArgs[0];
  return options;
}
