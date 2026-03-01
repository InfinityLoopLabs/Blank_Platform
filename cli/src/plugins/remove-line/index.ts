import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandPlugin, CommandStepRaw, PluginExecuteContext, PluginParseContext } from "../../types";

type RemoveLinePayload = {
  file: string;
  line: string;
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

function parseRemoveLinePayload(rawStep: CommandStepRaw, context: PluginParseContext): RemoveLinePayload {
  if (typeof rawStep.file !== "string" || typeof rawStep.line !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "remove-line" requires string fields "file" and "line".`,
    );
  }

  return {
    file: rawStep.file,
    line: rawStep.line,
  };
}

async function executeRemoveLinePayload(
  payload: RemoveLinePayload,
  context: PluginExecuteContext,
): Promise<void> {
  const filePath = path.resolve(context.cwd, resolveVariables(payload.file, context.variables));
  const lineToRemove = resolveVariables(payload.line, context.variables).trim();

  const content = await readFile(filePath, "utf8");
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const lines = content.split(/\r?\n/);

  const filtered = lines.filter((line) => line.trim() !== lineToRemove);
  await writeFile(filePath, filtered.join(eol), "utf8");
}

export const removeLinePlugin: CommandPlugin = {
  type: "remove-line",
  parse(rawStep, context) {
    return parseRemoveLinePayload(rawStep, context);
  },
  async execute(payload, context) {
    await executeRemoveLinePayload(payload as RemoveLinePayload, context);
  },
};
