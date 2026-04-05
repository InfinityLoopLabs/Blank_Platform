import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

type InitFileOptions = {
  cwd: string;
  repo?: string;
  ref?: string;
  force?: boolean;
};

type InitFileResult = {
  configPath: string;
};

const DEFAULT_REPO = "owner/template-repo";
const DEFAULT_REF = "main";
const CONFIG_FILE_NAME = "infinityloop.config.js";

function renderConfigTemplate(repo: string, ref: string): string {
  const repoValue = JSON.stringify(repo);
  const refValue = JSON.stringify(ref);

  return `module.exports = {
  commands: {
    bootstrap: [
      {
        type: "download",
        repo: ${repoValue},
        ref: ${refValue},
      },
    ],
  },
};
`;
}

export async function createInitConfigFile(options: InitFileOptions): Promise<InitFileResult> {
  const configPath = path.resolve(options.cwd, CONFIG_FILE_NAME);
  if (existsSync(configPath) && !options.force) {
    throw new Error(`Config file already exists: ${configPath}. Use --force to overwrite.`);
  }

  const content = renderConfigTemplate(options.repo ?? DEFAULT_REPO, options.ref ?? DEFAULT_REF);
  await writeFile(configPath, content, "utf8");

  return { configPath };
}
