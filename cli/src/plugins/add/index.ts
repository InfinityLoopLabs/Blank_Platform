import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandPlugin, CommandStepRaw, PluginExecuteContext, PluginParseContext } from "../../types";
import { isPlainObject } from "../../shared/is-plain-object";

type ReplaceRule = {
  from: string;
  to: string;
};

type AddPayload = {
  from: string;
  to: string;
  replace: ReplaceRule[];
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

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const capitalize = (value: string): string =>
  value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

function applyCaseFromMatch(match: string, replacement: string): string {
  if (match === match.toUpperCase() && /[A-Z]/.test(match)) {
    return replacement.toUpperCase();
  }
  if (match === match.toLowerCase()) {
    return replacement.toLowerCase();
  }

  const isCapitalized =
    match.charAt(0) === match.charAt(0).toUpperCase() &&
    match.slice(1) === match.slice(1).toLowerCase();

  if (isCapitalized) {
    return capitalize(replacement);
  }

  return replacement;
}

function applyReplaceRules(input: string, rules: ReplaceRule[], variables: Record<string, string | undefined>): string {
  let output = input;

  for (const rule of rules) {
    const replacement = resolveVariables(rule.to, variables);
    const pattern = new RegExp(escapeRegExp(rule.from), "gi");
    output = output.replace(pattern, (match) => applyCaseFromMatch(match, replacement));
  }

  return output;
}

function normalizeReplaceRules(rawRules: unknown, context: PluginParseContext): ReplaceRule[] {
  if (rawRules === undefined) {
    return [];
  }
  if (!Array.isArray(rawRules)) {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] field "replace" must be an array.`,
    );
  }

  const normalized: ReplaceRule[] = [];
  for (const [ruleIndex, rule] of rawRules.entries()) {
    if (!isPlainObject(rule)) {
      throw new Error(
        `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}].replace[${ruleIndex}] must be an object.`,
      );
    }

    if (typeof rule.from === "string" && typeof rule.to === "string") {
      normalized.push({ from: rule.from, to: rule.to });
      continue;
    }

    for (const [from, to] of Object.entries(rule)) {
      if (typeof to !== "string") {
        throw new Error(
          `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}].replace[${ruleIndex}] values must be strings.`,
        );
      }
      normalized.push({ from, to });
    }
  }

  return normalized;
}

function parseAddPayload(rawStep: CommandStepRaw, context: PluginParseContext): AddPayload {
  if (typeof rawStep.from !== "string" || typeof rawStep.to !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "add" requires string fields "from" and "to".`,
    );
  }

  return {
    from: rawStep.from,
    to: rawStep.to,
    replace: normalizeReplaceRules(rawStep.replace, context),
  };
}

function isLikelyTextFile(buffer: Buffer): boolean {
  const sizeToCheck = Math.min(buffer.length, 4000);
  for (let i = 0; i < sizeToCheck; i += 1) {
    if (buffer[i] === 0) {
      return false;
    }
  }
  return true;
}

async function copyFileWithTransforms(
  sourceFilePath: string,
  targetFilePath: string,
  replace: ReplaceRule[],
  context: PluginExecuteContext,
): Promise<void> {
  await mkdir(path.dirname(targetFilePath), { recursive: true });
  const buffer = await readFile(sourceFilePath);
  if (isLikelyTextFile(buffer)) {
    const transformed = applyReplaceRules(buffer.toString("utf8"), replace, context.variables);
    await writeFile(targetFilePath, transformed, "utf8");
  } else {
    await writeFile(targetFilePath, buffer);
  }
}

async function copyDirWithTransforms(
  sourceDir: string,
  targetDir: string,
  replace: ReplaceRule[],
  context: PluginExecuteContext,
): Promise<void> {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const transformedName = applyReplaceRules(entry.name, replace, context.variables);
    const targetPath = path.join(targetDir, transformedName);

    if (entry.isDirectory()) {
      await copyDirWithTransforms(sourcePath, targetPath, replace, context);
      continue;
    }

    if (entry.isFile()) {
      await copyFileWithTransforms(sourcePath, targetPath, replace, context);
    }
  }
}

async function executeAddPayload(payload: AddPayload, context: PluginExecuteContext): Promise<void> {
  const sourcePath = path.resolve(context.cwd, resolveVariables(payload.from, context.variables));
  const targetPath = path.resolve(context.cwd, resolveVariables(payload.to, context.variables));
  if (!existsSync(sourcePath)) {
    throw new Error(`Add source path does not exist: ${sourcePath}`);
  }

  const sourceStats = await stat(sourcePath);
  const transformedTargetPath = applyReplaceRules(targetPath, payload.replace, context.variables);

  if (sourceStats.isDirectory()) {
    await copyDirWithTransforms(sourcePath, transformedTargetPath, payload.replace, context);
    return;
  }

  if (sourceStats.isFile()) {
    let targetFilePath = transformedTargetPath;
    if (existsSync(transformedTargetPath)) {
      const targetStats = await stat(transformedTargetPath);
      if (targetStats.isDirectory()) {
        const sourceName = path.basename(sourcePath);
        const transformedName = applyReplaceRules(sourceName, payload.replace, context.variables);
        targetFilePath = path.join(transformedTargetPath, transformedName);
      }
    }
    await copyFileWithTransforms(sourcePath, targetFilePath, payload.replace, context);
    return;
  }

  throw new Error(`Add source path must be a file or directory: ${sourcePath}`);
}

export const addPlugin: CommandPlugin = {
  type: "add",
  parse(rawStep, context) {
    return parseAddPayload(rawStep, context);
  },
  async execute(payload, context) {
    await executeAddPayload(payload as AddPayload, context);
  },
};
