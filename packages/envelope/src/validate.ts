import { EnvelopeSerializationError, EnvelopeValidationError } from "./errors";
import { normalizeEnvelope } from "./normalize";
import { FORBIDDEN_TOKEN_REF_PATTERNS, SOURCE_REGEX, SPEC_VERSION, TRACEPARENT_REGEX, TYPE_REGEX } from "./schemas";
import type { MessageEnvelope, ValidationIssue } from "./types";

const AUTH_METHODS = new Set(["mTLS", "JWT", "mTLS+JWT", "API_KEY", "UNKNOWN"] as const);
const SIGNATURE_ALGS = new Set(["EdDSA", "ES256", "HS256"] as const);

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isIsoUtc(value: string): boolean {
  if (!value.endsWith("Z")) {
    return false;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return false;
  }

  return new Date(parsed).toISOString() === value;
}

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function addIssue(errors: ValidationIssue[], path: string, code: string, message: string): void {
  errors.push({ path, code, message });
}

function isLikelyRawToken(value: string): boolean {
  return FORBIDDEN_TOKEN_REF_PATTERNS.some((pattern) => pattern.test(value));
}

export function validateEnvelope<TData>(envelope: MessageEnvelope<TData>):
  | { ok: true }
  | { ok: false; errors: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];

  if (envelope.specversion !== SPEC_VERSION) {
    addIssue(errors, "specversion", "invalid_specversion", `specversion must be ${SPEC_VERSION}`);
  }

  if (!envelope.id?.trim()) {
    addIssue(errors, "id", "required", "id is required");
  }

  if (!TYPE_REGEX.test(envelope.type ?? "")) {
    addIssue(errors, "type", "invalid_format", "type must match ^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)+$");
  }

  if (!SOURCE_REGEX.test(envelope.source ?? "")) {
    addIssue(errors, "source", "invalid_format", "source must match ^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)*$");
  }

  if (!isIsoUtc(envelope.time ?? "")) {
    addIssue(errors, "time", "invalid_time", "time must be a valid ISO-8601 UTC string");
  }

  if (!envelope.datacontenttype?.trim()) {
    addIssue(errors, "datacontenttype", "required", "datacontenttype is required");
  }

  if (!envelope.correlation_id?.trim()) {
    addIssue(errors, "correlation_id", "required", "correlation_id is required");
  }

  if (!envelope.idempotency_key?.trim()) {
    addIssue(errors, "idempotency_key", "required", "idempotency_key is required");
  }

  if (!Number.isInteger(envelope.retry_count) || envelope.retry_count < 0) {
    addIssue(errors, "retry_count", "invalid_integer", "retry_count must be an integer >= 0");
  }

  if (envelope.ttl_sec !== undefined && (!Number.isInteger(envelope.ttl_sec) || envelope.ttl_sec <= 0)) {
    addIssue(errors, "ttl_sec", "invalid_integer", "ttl_sec must be an integer > 0");
  }

  if (envelope.dataschema && !isValidAbsoluteUrl(envelope.dataschema)) {
    addIssue(errors, "dataschema", "invalid_url", "dataschema must be a valid absolute HTTP(S) URL");
  }

  if (envelope.traceparent && !TRACEPARENT_REGEX.test(envelope.traceparent)) {
    addIssue(errors, "traceparent", "invalid_traceparent", "traceparent must match W3C trace context format");
  }

  if (envelope.actor) {
    if (!envelope.actor.sub?.trim()) {
      addIssue(errors, "actor.sub", "required", "actor.sub is required when actor is provided");
    }

    if (envelope.actor.scopes) {
      const sortedUnique = [...new Set(envelope.actor.scopes)].sort((a, b) => a.localeCompare(b));
      const scopesAreSortedUnique =
        sortedUnique.length === envelope.actor.scopes.length &&
        sortedUnique.every((scope, index) => scope === envelope.actor?.scopes?.[index]);

      if (!scopesAreSortedUnique) {
        addIssue(errors, "actor.scopes", "invalid_scopes", "actor.scopes must be unique and sorted");
      }
    }
  }

  if (envelope.auth_context) {
    if (!AUTH_METHODS.has(envelope.auth_context.method)) {
      addIssue(errors, "auth_context.method", "invalid_auth_method", "auth_context.method has unsupported value");
    }

    if (envelope.auth_context.token_ref && isLikelyRawToken(envelope.auth_context.token_ref)) {
      addIssue(
        errors,
        "auth_context.token_ref",
        "token_ref_security",
        "auth_context.token_ref must store a token reference, not a raw token",
      );
    }
  }

  if (envelope.signature) {
    if (!SIGNATURE_ALGS.has(envelope.signature.alg)) {
      addIssue(errors, "signature.alg", "invalid_signature_alg", "signature.alg has unsupported value");
    }

    if (!envelope.signature.kid?.trim()) {
      addIssue(errors, "signature.kid", "required", "signature.kid is required");
    }

    if (!envelope.signature.value?.trim()) {
      addIssue(errors, "signature.value", "required", "signature.value is required");
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}

export function parseEnvelope<TData = unknown>(input: unknown): MessageEnvelope<TData> {
  if (!isObject(input)) {
    throw new EnvelopeSerializationError("Envelope must be a JSON object");
  }

  let envelope: MessageEnvelope<TData>;
  try {
    envelope = normalizeEnvelope(input as Partial<MessageEnvelope<TData>>);
  } catch (error) {
    if (error instanceof EnvelopeValidationError || error instanceof EnvelopeSerializationError) {
      throw error;
    }

    throw new EnvelopeSerializationError("Failed to normalize envelope");
  }

  const result = validateEnvelope(envelope);
  if (!result.ok) {
    throw new EnvelopeValidationError("Envelope validation failed", result.errors);
  }

  return envelope;
}
