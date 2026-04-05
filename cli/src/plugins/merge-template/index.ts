import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { CommandPlugin, CommandStepRaw, PluginExecuteContext, PluginParseContext } from "../../types";

const execFileAsync = promisify(execFile);

type MergeTemplatePayload = {
  repo: string;
  ref: string;
  allowUnrelatedHistories: boolean;
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

function parseMergeTemplatePayload(rawStep: CommandStepRaw, context: PluginParseContext): MergeTemplatePayload {
  if (typeof rawStep.repo !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "merge-template" requires string field "repo".`,
    );
  }

  if (rawStep.ref !== undefined && typeof rawStep.ref !== "string") {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "merge-template" field "ref" must be a string.`,
    );
  }

  if (
    rawStep.allowUnrelatedHistories !== undefined &&
    typeof rawStep.allowUnrelatedHistories !== "boolean"
  ) {
    throw new Error(
      `Config "${context.configPath}" commands["${context.commandKey}"][${context.stepIndex}] type "merge-template" field "allowUnrelatedHistories" must be a boolean.`,
    );
  }

  return {
    repo: rawStep.repo,
    ref: (rawStep.ref as string | undefined) ?? "main",
    allowUnrelatedHistories: rawStep.allowUnrelatedHistories !== false,
  };
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

async function ensureGitRepository(cwd: string): Promise<void> {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--is-inside-work-tree"], { cwd });
    if (stdout.trim() !== "true") {
      throw new Error("Not a git work tree.");
    }
  } catch {
    throw new Error(`Current directory is not a git repository: ${cwd}`);
  }
}

async function runGit(args: string[], cwd: string): Promise<void> {
  try {
    await execFileAsync("git", args, { cwd });
  } catch (error) {
    const details = extractExecErrorDetails(error);
    throw new Error(`Git command failed: git ${args.join(" ")}. ${details}`);
  }
}

async function executeMergeTemplatePayload(
  payload: MergeTemplatePayload,
  context: PluginExecuteContext,
): Promise<void> {
  await ensureGitRepository(context.cwd);

  const repo = normalizeRepoSource(resolveVariables(payload.repo, context.variables));
  const ref = resolveVariables(payload.ref, context.variables);
  const remoteName = `ill-template-${Date.now()}`;

  try {
    await runGit(["remote", "add", remoteName, repo], context.cwd);
    await runGit(["fetch", "--depth", "1", remoteName, ref], context.cwd);

    const mergeArgs = ["merge", "--no-ff", "--no-commit"];
    if (payload.allowUnrelatedHistories) {
      mergeArgs.push("--allow-unrelated-histories");
    }
    mergeArgs.push("FETCH_HEAD");

    await runGit(mergeArgs, context.cwd);
  } finally {
    await execFileAsync("git", ["remote", "remove", remoteName], { cwd: context.cwd }).catch(() => undefined);
  }
}

export const mergeTemplatePlugin: CommandPlugin = {
  type: "merge-template",
  parse(rawStep, context) {
    return parseMergeTemplatePayload(rawStep, context);
  },
  async execute(payload, context) {
    await executeMergeTemplatePayload(payload as MergeTemplatePayload, context);
  },
};
