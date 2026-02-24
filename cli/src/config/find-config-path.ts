import { existsSync } from "node:fs";
import path from "node:path";
import { CONFIG_FILE_NAMES } from "./config-types";

export function findConfigPath(cwd: string): string | undefined {
  for (const configName of CONFIG_FILE_NAMES) {
    const absolutePath = path.resolve(cwd, configName);
    if (existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  return undefined;
}
