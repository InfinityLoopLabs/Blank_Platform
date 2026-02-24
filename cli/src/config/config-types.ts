import type { CommandStep } from "../commands/types";

export const CONFIG_FILE_NAMES = [
  "infinityloop.config.js",
  "infinityloop.config.mjs",
  "infinityloop.config.cjs",
] as const;

export type InfinityloopConfig = {
  commands?: Record<string, CommandStep[]>;
};

export type LoadedConfig = {
  config: InfinityloopConfig;
  configPath?: string;
};
