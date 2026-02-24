import type { ReplaceRule, VariableMap } from "./types";

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const capitalize = (value: string): string =>
  value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

function applyCaseFromMatch(match: string, replacement: string): string {
  if (match.length === 0) {
    return replacement;
  }

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

export function resolveVariables(value: string, variables: VariableMap): string {
  return value.replace(/\$([A-Za-z_]\w*)/g, (_, variableName: string) => {
    const resolved = variables[variableName];
    if (!resolved) {
      throw new Error(`Variable "$${variableName}" is required but was not provided.`);
    }
    return resolved;
  });
}

export function applyReplaceRules(
  input: string,
  rules: ReplaceRule[],
  variables: VariableMap,
): string {
  let output = input;

  for (const rule of rules) {
    const replacement = resolveVariables(rule.to, variables);
    const pattern = new RegExp(escapeRegExp(rule.from), "gi");
    output = output.replace(pattern, (match) => applyCaseFromMatch(match, replacement));
  }

  return output;
}
