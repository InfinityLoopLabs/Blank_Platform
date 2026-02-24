import type { ReplaceRule } from "../commands/types";
import { isPlainObject } from "../shared/is-plain-object";

export function normalizeReplaceRules(
  rawRules: unknown,
  configPath: string,
  commandKey: string,
  stepIndex: number,
): ReplaceRule[] {
  if (rawRules === undefined) {
    return [];
  }

  if (!Array.isArray(rawRules)) {
    throw new Error(
      `Config "${configPath}" commands["${commandKey}"][${stepIndex}] field "replace" must be an array.`,
    );
  }

  const normalized: ReplaceRule[] = [];
  for (const [ruleIndex, ruleValue] of rawRules.entries()) {
    if (!isPlainObject(ruleValue)) {
      throw new Error(
        `Config "${configPath}" commands["${commandKey}"][${stepIndex}].replace[${ruleIndex}] must be an object.`,
      );
    }

    if (typeof ruleValue.from === "string" && typeof ruleValue.to === "string") {
      normalized.push({ from: ruleValue.from, to: ruleValue.to });
      continue;
    }

    for (const [search, replacement] of Object.entries(ruleValue)) {
      if (typeof replacement !== "string") {
        throw new Error(
          `Config "${configPath}" commands["${commandKey}"][${stepIndex}].replace[${ruleIndex}] values must be strings.`,
        );
      }
      normalized.push({ from: search, to: replacement });
    }
  }

  return normalized;
}
