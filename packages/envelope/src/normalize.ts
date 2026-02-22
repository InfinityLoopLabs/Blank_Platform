import { createHash, randomBytes } from "node:crypto";

import { EnvelopeSecurityError, EnvelopeValidationError } from "./errors";
import { FORBIDDEN_TOKEN_REF_PATTERNS, SPEC_VERSION } from "./schemas";
import type { AuthContext, CreateEnvelopeInput, MessageEnvelope, SignatureBlock } from "./types";

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function issue(path: string, code: string, message: string) {
  return { path, code, message };
}

function trimString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeInteger(value: unknown, defaultValue: number, path: string, min: number): number {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || !Number.isInteger(numeric) || numeric < min) {
    throw new EnvelopeValidationError(`${path} must be an integer >= ${min}`, [
      issue(path, "invalid_integer", `${path} must be an integer >= ${min}`),
    ]);
  }

  return numeric;
}

function normalizeOptionalPositiveInteger(value: unknown, path: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || !Number.isInteger(numeric) || numeric <= 0) {
    throw new EnvelopeValidationError(`${path} must be an integer > 0`, [
      issue(path, "invalid_integer", `${path} must be an integer > 0`),
    ]);
  }

  return numeric;
}

function normalizeScopes(scopes: unknown): string[] | undefined {
  if (!Array.isArray(scopes)) {
    return undefined;
  }

  const unique = new Set<string>();
  for (const scope of scopes) {
    const trimmed = trimString(scope);
    if (trimmed) {
      unique.add(trimmed);
    }
  }

  if (unique.size === 0) {
    return undefined;
  }

  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

function getRandomBuffer(size: number): Uint8Array {
  const webCrypto = globalThis.crypto;
  if (webCrypto && typeof webCrypto.getRandomValues === "function") {
    const out = new Uint8Array(size);
    webCrypto.getRandomValues(out);
    return out;
  }

  return randomBytes(size);
}

function encodeTime(nowMs: number): string {
  let value = nowMs;
  let encoded = "";

  for (let i = 0; i < 10; i += 1) {
    encoded = ULID_ALPHABET[value % 32] + encoded;
    value = Math.floor(value / 32);
  }

  return encoded;
}

function encodeRandom(size: number): string {
  const bytes = getRandomBuffer(10); // 80 bits
  let out = "";
  let value = 0;
  let bits = 0;

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5 && out.length < size) {
      out += ULID_ALPHABET[(value >> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  while (out.length < size) {
    out += ULID_ALPHABET[(value << (5 - bits)) & 31];
    bits = Math.max(0, bits - 5);
  }

  return out;
}

export function generateUlid(nowMs: number = Date.now()): string {
  return `${encodeTime(nowMs)}${encodeRandom(16)}`;
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? "null" : serialized;
  }

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => {
        if (item === undefined) {
          return "null";
        }
        return canonicalJson(item);
      })
      .join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record)
    .filter((key) => record[key] !== undefined)
    .sort((a, b) => a.localeCompare(b));

  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
}

export function deriveDeterministicIdempotencyKey(input: {
  type: string;
  source: string;
  subject?: string;
  correlation_id: string;
  data: unknown;
}): string {
  const basis = {
    type: input.type,
    source: input.source,
    subject: input.subject ?? null,
    correlation_id: input.correlation_id,
    data: input.data,
  };

  const digest = createHash("sha256").update(canonicalJson(basis), "utf8").digest("hex");
  return `sha256:${digest}`;
}

function sanitizeTokenRef(tokenRef: unknown): string | undefined {
  const trimmed = trimString(tokenRef);
  if (!trimmed) {
    return undefined;
  }

  for (const pattern of FORBIDDEN_TOKEN_REF_PATTERNS) {
    if (pattern.test(trimmed)) {
      throw new EnvelopeSecurityError("auth_context.token_ref must be a token reference, not a raw token");
    }
  }

  return trimmed;
}

function normalizeSignature(signature: SignatureBlock | undefined): SignatureBlock | undefined {
  if (!signature) {
    return undefined;
  }

  const alg = trimString(signature.alg);
  const kid = trimString(signature.kid);
  const value = trimString(signature.value);

  if (!alg || !kid || !value) {
    throw new EnvelopeValidationError("signature fields alg, kid and value are required", [
      issue("signature", "invalid_signature", "signature fields alg, kid and value are required"),
    ]);
  }

  return {
    alg: alg as SignatureBlock["alg"],
    kid,
    value,
  };
}

export function normalizeEnvelope<TData>(input: Partial<MessageEnvelope<TData>> | CreateEnvelopeInput<TData>): MessageEnvelope<TData> {
  const type = trimString(input.type);
  const source = trimString(input.source);

  if (!type) {
    throw new EnvelopeValidationError("type is required", [issue("type", "required", "type is required")]);
  }

  if (!source) {
    throw new EnvelopeValidationError("source is required", [issue("source", "required", "source is required")]);
  }

  if (!("data" in input)) {
    throw new EnvelopeValidationError("data is required", [issue("data", "required", "data is required")]);
  }

  const id = trimString(input.id) ?? generateUlid();
  const time = trimString(input.time) ?? new Date().toISOString();
  const subject = trimString(input.subject);
  const datacontenttype = trimString(input.datacontenttype) ?? "application/json";
  const correlation_id = trimString(input.correlation_id) ?? id;

  const actorSub = trimString(input.actor?.sub);
  const actorAct = trimString(input.actor?.act);
  const actorScopes = normalizeScopes(input.actor?.scopes);

  const actor = actorSub
    ? {
        sub: actorSub,
        act: actorAct,
        scopes: actorScopes,
      }
    : undefined;

  const authMethod = trimString(input.auth_context?.method) as AuthContext["method"] | undefined;
  const token_ref = sanitizeTokenRef(input.auth_context?.token_ref);

  const auth_context = authMethod
    ? {
        method: authMethod,
        token_ref,
      }
    : undefined;

  const envelope: MessageEnvelope<TData> = {
    specversion: SPEC_VERSION,
    id,
    type,
    source,
    subject,
    time,
    datacontenttype,
    dataschema: trimString(input.dataschema),
    traceparent: trimString(input.traceparent),
    tracestate: trimString(input.tracestate),
    correlation_id,
    causation_id: trimString(input.causation_id),
    tenant_id: trimString(input.tenant_id),
    actor,
    auth_context,
    idempotency_key:
      trimString(input.idempotency_key) ??
      deriveDeterministicIdempotencyKey({
        type,
        source,
        subject,
        correlation_id,
        data: input.data,
      }),
    ttl_sec: normalizeOptionalPositiveInteger(input.ttl_sec, "ttl_sec"),
    retry_count: normalizeInteger(input.retry_count, 0, "retry_count", 0),
    signature: normalizeSignature(input.signature),
    data: input.data as TData,
  };

  return envelope;
}
