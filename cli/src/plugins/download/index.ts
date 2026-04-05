import { execFile } from "node:child_process";
import { cp, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import type { CommandPlugin, CommandStepRaw, PluginExecuteContext, PluginParseContext } from "../../types";

const execFileAsync = promisify(execFile);

type DownloadPayload = {
  repo: string;
  ref?: string;
  allowNonEmpty: boolean;
};

type ExecFileError = Error & {
  stderr?: string | Buffer;
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

function parseDownloadPayload(rawStep: CommandStepRaw, context: PluginParseContext): DownloadPayload {
  if (typeof rawStep.repo !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "download" requires string field "repo".`,
    );
  }

  if (rawStep.ref !== undefined && typeof rawStep.ref !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "download" field "ref" must be a string.`,
    );
  }

  if (rawStep.allowNonEmpty !== undefined && typeof rawStep.allowNonEmpty !== "boolean") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "download" field "allowNonEmpty" must be a boolean.`,
    );
  }

  return {
    repo: rawStep.repo,
    ref: rawStep.ref as string | undefined,
    allowNonEmpty: rawStep.allowNonEmpty === true,
  };
}

function isGithubShorthand(repo: string): boolean {
  if (
    repo.includes("://") ||
    repo.startsWith("git@") ||
    repo.startsWith(".") ||
    repo.startsWith("/") ||
    repo.startsWith("~") ||
    repo.includes("\\") ||
    repo.endsWith(".git")
  ) {
    return false;
  }

  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo);
}

function normalizeRepoSource(repo: string): string {
  if (isGithubShorthand(repo)) {
    return `https://github.com/${repo}.git`;
  }
  return repo;
}

function isGitRelatedName(name: string): boolean {
  return name === ".git" || name === ".github" || name.startsWith(".git");
}

async function ensureTargetIsEmpty(cwd: string): Promise<void> {
  const entries = await readdir(cwd);
  if (entries.length > 0) {
    throw new Error(
      `Download target "${cwd}" must be empty. Pass "allowNonEmpty: true" in config if overwrite is intended.`,
    );
  }
}

function extractExecErrorDetails(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const execError = error as ExecFileError;
  const stderr = execError.stderr
    ? typeof execError.stderr === "string"
      ? execError.stderr
      : execError.stderr.toString("utf8")
    : "";

  const suffix = stderr.trim();
  return suffix ? `${error.message}: ${suffix}` : error.message;
}

async function runGitClone(repo: string, ref: string | undefined, targetPath: string, cwd: string): Promise<void> {
  const args = ["clone", "--depth", "1"];
  if (ref) {
    args.push("--branch", ref);
  }
  args.push(repo, targetPath);

  try {
    await execFileAsync("git", args, { cwd });
  } catch (error) {
    const details = extractExecErrorDetails(error);
    throw new Error(`Failed to clone repository "${repo}"${ref ? ` at "${ref}"` : ""}. ${details}`);
  }
}

async function copyTemplateToCwd(sourceRepoDir: string, cwd: string): Promise<void> {
  const entries = await readdir(sourceRepoDir, { withFileTypes: true });

  for (const entry of entries) {
    if (isGitRelatedName(entry.name)) {
      continue;
    }

    const sourcePath = path.join(sourceRepoDir, entry.name);
    const targetPath = path.join(cwd, entry.name);
    await cp(sourcePath, targetPath, {
      recursive: true,
      force: true,
      errorOnExist: false,
      filter: (source) => {
        const relativePath = path.relative(sourceRepoDir, source);
        if (!relativePath || relativePath === ".") {
          return true;
        }

        const parts = relativePath.split(path.sep);
        return !parts.some((part) => isGitRelatedName(part));
      },
    });
  }
}

async function executeDownloadPayload(payload: DownloadPayload, context: PluginExecuteContext): Promise<void> {
  if (!payload.allowNonEmpty) {
    await ensureTargetIsEmpty(context.cwd);
  }

  const repo = normalizeRepoSource(resolveVariables(payload.repo, context.variables));
  const ref = payload.ref ? resolveVariables(payload.ref, context.variables) : undefined;

  const tempRoot = await mkdtemp(path.join(tmpdir(), "ill-download-"));
  const tempRepoDir = path.join(tempRoot, "template");

  try {
    await runGitClone(repo, ref, tempRepoDir, context.cwd);
    await copyTemplateToCwd(tempRepoDir, context.cwd);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

export const downloadPlugin: CommandPlugin = {
  type: "download",
  parse(rawStep, context) {
    return parseDownloadPayload(rawStep, context);
  },
  async execute(payload, context) {
    await executeDownloadPayload(payload as DownloadPayload, context);
  },
};
