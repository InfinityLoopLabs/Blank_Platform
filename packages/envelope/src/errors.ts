import type { ValidationIssue } from "./types";

export class EnvelopeValidationError extends Error {
  public readonly issues: ValidationIssue[];

  public constructor(message: string, issues: ValidationIssue[] = []) {
    super(message);
    this.name = "EnvelopeValidationError";
    this.issues = issues;
  }
}

export class EnvelopeSecurityError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "EnvelopeSecurityError";
  }
}

export class EnvelopeSerializationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "EnvelopeSerializationError";
  }
}
