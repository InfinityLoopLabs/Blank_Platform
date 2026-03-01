import type { CommandPlugin } from "../types";
import { addPlugin } from "./add";
import { insertPlugin } from "./insert";
import { removeLinePlugin } from "./remove-line";
import { removePlugin } from "./remove";

export const builtinPlugins: CommandPlugin[] = [addPlugin, insertPlugin, removeLinePlugin, removePlugin];
