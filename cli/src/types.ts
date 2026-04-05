export type Variables = Record<string, string | undefined>;

export type CliOptions = {
  cwd: string;
  configPath?: string;
  commandKey?: string;
  name?: string;
  repo?: string;
  targetRepo?: string;
  ref?: string;
  force?: boolean;
};

export type CommandStepRaw = {
  type: string;
  [key: string]: unknown;
};

export type ProjectConfig = {
  commands?: Record<string, CommandStepRaw[]>;
};

export type LoadedProjectConfig = {
  config: ProjectConfig;
  configPath?: string;
};

export type PluginParseContext = {
  configPath: string;
  commandKey: string;
  stepIndex: number;
};

export type PluginExecuteContext = {
  cwd: string;
  variables: Variables;
};

export type CommandPlugin = {
  type: string;
  parse: (rawStep: CommandStepRaw, context: PluginParseContext) => unknown;
  execute: (payload: unknown, context: PluginExecuteContext) => Promise<void>;
};
