import type { CommandPlugin } from "../types";
import { addPlugin } from "./add";
import { downloadPlugin } from "./download";
import { insertPlugin } from "./insert";
import { removeLinePlugin } from "./remove-line";
import { removePlugin } from "./remove";

export const builtinPlugins: CommandPlugin[] = [addPlugin, downloadPlugin, insertPlugin, removeLinePlugin, removePlugin];
