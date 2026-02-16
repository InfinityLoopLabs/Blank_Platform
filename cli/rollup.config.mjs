import { builtinModules } from "node:module";
import typescript from "@rollup/plugin-typescript";

const externalModules = new Set([
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
]);

function addCliShebang() {
  return {
    name: "add-cli-shebang",
    generateBundle(_outputOptions, bundle) {
      const cliChunk = bundle["cli.js"];
      if (!cliChunk || cliChunk.type !== "chunk") {
        return;
      }

      if (!cliChunk.code.startsWith("#!/usr/bin/env node")) {
        cliChunk.code = `#!/usr/bin/env node\n${cliChunk.code}`;
      }
    },
  };
}

export default {
  input: {
    index: "src/index.ts",
    cli: "src/cli.ts",
  },
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: true,
    entryFileNames: "[name].js",
    exports: "named",
  },
  external: (id) => externalModules.has(id) || id.startsWith("node:"),
  plugins: [
    typescript({
      tsconfig: "./tsconfig.rollup.json",
      declaration: false,
      declarationMap: false,
    }),
    addCliShebang(),
  ],
};
