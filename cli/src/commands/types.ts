export type VariableMap = Record<string, string | undefined>;

export type ReplaceRule = {
  from: string;
  to: string;
};

export type AddCommandStep = {
  type: "add";
  from: string;
  to: string;
  replace?: ReplaceRule[];
};

export type PasteCommandStep = {
  type: "paste";
  to: string;
  content: string;
  mode?: "append" | "prepend" | "replace";
};

export type RemoveCommandStep = {
  type: "remove";
  target: string;
};

export type CommandStep = AddCommandStep | PasteCommandStep | RemoveCommandStep;
