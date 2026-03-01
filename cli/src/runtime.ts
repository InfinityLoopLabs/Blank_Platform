import type { CommandPlugin, CommandStepRaw, ProjectConfig, Variables } from "./types";

type PluginRegistry = Map<string, CommandPlugin>;

export function createPluginRegistry(plugins: CommandPlugin[]): PluginRegistry {
  const registry: PluginRegistry = new Map();
  for (const plugin of plugins) {
    if (registry.has(plugin.type)) {
      throw new Error(`Duplicate plugin type "${plugin.type}" in plugin registry.`);
    }
    registry.set(plugin.type, plugin);
  }
  return registry;
}

function getPluginOrThrow(registry: PluginRegistry, type: string, contextMessage: string): CommandPlugin {
  const plugin = registry.get(type);
  if (plugin) {
    return plugin;
  }

  const available = Array.from(registry.keys()).sort();
  const availableText = available.length > 0 ? available.join(", ") : "<empty>";
  throw new Error(`${contextMessage}. Available plugin types: ${availableText}.`);
}

export async function runCommandByKey(
  config: ProjectConfig,
  commandKey: string | undefined,
  cwd: string,
  variables: Variables,
  plugins: CommandPlugin[],
  configPathForErrors = "infinityloop.config.*",
): Promise<number> {
  if (!commandKey) {
    throw new Error("Command key is required. Usage: ill <commandKey> --name=<value>.");
  }

  const commands = config.commands ?? {};
  const steps = commands[commandKey];
  if (!steps) {
    const keys = Object.keys(commands).sort();
    const keysText = keys.length > 0 ? keys.join(", ") : "<empty>";
    throw new Error(`Unknown command key "${commandKey}". Available keys: ${keysText}.`);
  }

  const registry = createPluginRegistry(plugins);
  for (const [stepIndex, step] of steps.entries()) {
    const plugin = getPluginOrThrow(
      registry,
      step.type,
      `Unknown command type "${step.type}" at commands["${commandKey}"][${stepIndex}]`,
    );
    const payload = plugin.parse(step as CommandStepRaw, {
      configPath: configPathForErrors,
      commandKey,
      stepIndex,
    });
    await plugin.execute(payload, { cwd, variables });
  }

  return steps.length;
}
