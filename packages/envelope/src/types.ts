import type { KeyObject } from "node:crypto";

export type SpecVersion = "1.0";

export interface ActorContext {
  sub: string;
  act?: string;
  scopes?: string[];
}

export interface AuthContext {
  method: "mTLS" | "JWT" | "mTLS+JWT" | "API_KEY" | "UNKNOWN";
  token_ref?: string;
}

export interface SignatureBlock {
  alg: "EdDSA" | "ES256" | "HS256";
  kid: string;
  value: string;
}

export interface MessageEnvelope<TData = unknown> {
  specversion: SpecVersion;
  id: string;
  type: string;
  source: string;
  subject?: string;
  time: string;
  datacontenttype: string;
  dataschema?: string;
  traceparent?: string;
  tracestate?: string;
  correlation_id: string;
  causation_id?: string;
  tenant_id?: string;
  actor?: ActorContext;
  auth_context?: AuthContext;
  idempotency_key: string;
  ttl_sec?: number;
  retry_count: number;
  signature?: SignatureBlock;
  data: TData;
}

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface CreateEnvelopeInput<TData> {
  id?: string;
  type: string;
  source: string;
  subject?: string;
  time?: string;
  datacontenttype?: string;
  dataschema?: string;
  traceparent?: string;
  tracestate?: string;
  correlation_id?: string;
  causation_id?: string;
  tenant_id?: string;
  actor?: ActorContext;
  auth_context?: AuthContext;
  idempotency_key?: string;
  ttl_sec?: number;
  retry_count?: number;
  signature?: SignatureBlock;
  data: TData;
}

export interface CreateErrorReplyInput
  extends Omit<CreateEnvelopeInput<{ code: string; message: string; details?: unknown }>, "data" | "type"> {
  type?: string;
  code: string;
  message: string;
  details?: unknown;
}

export type KeyLike = string | Uint8Array | Buffer | KeyObject;

export interface EdDsaOrEs256SignerConfig {
  alg: "EdDSA" | "ES256";
  kid: string;
  privateKey: KeyLike;
  outputEncoding?: "base64" | "base64url";
}

export interface Hs256SignerConfig {
  alg: "HS256";
  kid: string;
  secret: KeyLike;
  outputEncoding?: "base64" | "base64url";
}

export type SignerConfig = EdDsaOrEs256SignerConfig | Hs256SignerConfig;

export interface VerifierConfig {
  keysByKid?: Record<string, KeyLike>;
  getKey?: (kid: string, alg: SignatureBlock["alg"]) => KeyLike | undefined;
  allowedAlgorithms?: SignatureBlock["alg"][];
}

export interface EnvelopeHeaderContext {
  traceparent?: string;
  tracestate?: string;
  correlation_id?: string;
  causation_id?: string;
  tenant_id?: string;
}

export type HeadersLike =
  | Headers
  | Record<string, string | number | string[] | undefined | null>
  | Array<[string, string]>;
