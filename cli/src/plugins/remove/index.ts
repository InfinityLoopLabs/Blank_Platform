import { rm } from "node:fs/promises";
import path from "node:path";
import type { CommandPlugin, CommandStepRaw, PluginExecuteContext, PluginParseContext } from "../../types";

type RemovePayload = {
  target: string;
};

function resolveVariables(value: string, variables: Record<string, string | undefined>): string {
  return value.replace(/\$([A-Za-z_]\w*)/g, (_, variableName: string) => {
    const resolved = variables[variableName];
    if (!resolved) {
      throw new Error(`Variable "$${variableName}" is required but was not provided.`);
    }
    return resolved;
  });
}

function parseRemovePayload(rawStep: CommandStepRaw, context: PluginParseContext): RemovePayload {
  if (typeof rawStep.target !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "remove" requires string field "target".`,
    );
  }

  return {
    target: rawStep.target,
  };
}

async function executeRemovePayload(payload: RemovePayload, context: PluginExecuteContext): Promise<void> {
  const targetPath = path.resolve(context.cwd, resolveVariables(payload.target, context.variables));
  await rm(targetPath, { recursive: true, force: true });
}

export const removePlugin: CommandPlugin = {
  type: "remove",
  parse(rawStep, context) {
    return parseRemovePayload(rawStep, context);
  },
  async execute(payload, context) {
    await executeRemovePayload(payload as RemovePayload, context);
  },
};
