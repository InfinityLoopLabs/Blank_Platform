import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandPlugin, CommandStepRaw, PluginExecuteContext, PluginParseContext } from "../../types";

type InsertPayload = {
  file: string;
  placeholder: string;
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

function parseInsertPayload(rawStep: CommandStepRaw, context: PluginParseContext): InsertPayload {
  if (
    typeof rawStep.file !== "string" ||
    typeof rawStep.placeholder !== "string" ||
    typeof rawStep.line !== "string"
  ) {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "insert" requires string fields "file", "placeholder", "line".`,
    );
  }

  return {
    file: rawStep.file,
    placeholder: rawStep.placeholder,
    line: rawStep.line,
  };
}

async function executeInsertPayload(payload: InsertPayload, context: PluginExecuteContext): Promise<void> {
  const filePath = path.resolve(context.cwd, resolveVariables(payload.file, context.variables));
  const placeholder = resolveVariables(payload.placeholder, context.variables);
  const line = resolveVariables(payload.line, context.variables);

  const content = await readFile(filePath, "utf8");
  if (!content.includes(placeholder)) {
    throw new Error(`Insert placeholder "${placeholder}" not found in file: ${filePath}`);
  }

  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const updated = content.replace(placeholder, `${placeholder}${eol}${line}`);
  await writeFile(filePath, updated, "utf8");
}

export const insertPlugin: CommandPlugin = {
  type: "insert",
  parse(rawStep, context) {
    return parseInsertPayload(rawStep, context);
  },
  async execute(payload, context) {
    await executeInsertPayload(payload as InsertPayload, context);
  },
};
