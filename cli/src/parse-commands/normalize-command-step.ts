import type { CommandStep } from "../commands/types";
import { isPlainObject } from "../shared/is-plain-object";
import { normalizeReplaceRules } from "./normalize-replace-rules";

export function normalizeCommandStep(
  rawStep: unknown,
  configPath: string,
  commandKey: string,
  stepIndex: number,
): CommandStep {
  if (!isPlainObject(rawStep)) {
    throw new Error(
      `Config "${configPath}" commands["${commandKey}"][${stepIndex}] must be an object.`,
    );
  }

  if (rawStep.type === "add") {
    if (typeof rawStep.from !== "string" || typeof rawStep.to !== "string") {
      throw new Error(
        `Config "${configPath}" commands["${commandKey}"][${stepIndex}] type "add" requires string fields "from" and "to".`,
      );
    }

    return {
      type: "add",
      from: rawStep.from,
      to: rawStep.to,
      replace: normalizeReplaceRules(rawStep.replace, configPath, commandKey, stepIndex),
    };
  }

  if (rawStep.type === "paste") {
    if (typeof rawStep.to !== "string" || typeof rawStep.content !== "string") {
      throw new Error(
        `Config "${configPath}" commands["${commandKey}"][${stepIndex}] type "paste" requires string fields "to" and "content".`,
      );
    }

    if (
      rawStep.mode !== undefined &&
      rawStep.mode !== "append" &&
      rawStep.mode !== "prepend" &&
      rawStep.mode !== "replace"
    ) {
      throw new Error(
        `Config "${configPath}" commands["${commandKey}"][${stepIndex}] type "paste" field "mode" must be append|prepend|replace.`,
      );
    }

    return {
      type: "paste",
      to: rawStep.to,
      content: rawStep.content,
      mode: rawStep.mode,
    };
  }

  if (rawStep.type === "remove") {
    if (typeof rawStep.target !== "string") {
      throw new Error(
        `Config "${configPath}" commands["${commandKey}"][${stepIndex}] type "remove" requires string field "target".`,
      );
    }

    return {
      type: "remove",
      target: rawStep.target,
    };
  }

  throw new Error(
    `Config "${configPath}" commands["${commandKey}"][${stepIndex}] has unknown type "${String(
      rawStep.type,
    )}". Supported types: add|paste|remove.`,
  );
}
