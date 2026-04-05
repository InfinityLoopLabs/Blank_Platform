import type { CommandPlugin } from "../types";
import { addPlugin } from "./add";
import { downloadPlugin } from "./download";
import { insertPlugin } from "./insert";
import { mergeTemplatePlugin } from "./merge-template";
import { removeLinePlugin } from "./remove-line";
import { removePlugin } from "./remove";

export const builtinPlugins: CommandPlugin[] = [
  addPlugin,
  downloadPlugin,
  mergeTemplatePlugin,
  insertPlugin,
  removeLinePlugin,
  removePlugin,
];
