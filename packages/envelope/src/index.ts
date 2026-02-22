export type {
  ActorContext,
  AuthContext,
  CreateEnvelopeInput,
  CreateErrorReplyInput,
  EnvelopeHeaderContext,
  HeadersLike,
  KeyLike,
  MessageEnvelope,
  SignatureBlock,
  SignerConfig,
  SpecVersion,
  ValidationIssue,
  VerifierConfig,
} from "./types";

export { ENVELOPE_JSON_SCHEMA, SOURCE_REGEX, SPEC_VERSION, TRACEPARENT_REGEX, TYPE_REGEX } from "./schemas";

export { EnvelopeSecurityError, EnvelopeSerializationError, EnvelopeValidationError } from "./errors";

export { createCommand, createErrorReply, createEvent, createReply } from "./factories";

export { normalizeEnvelope } from "./normalize";

export { fromHeaders, injectTraceFromOtel, toHeaders } from "./headers";

export { signEnvelope, verifyEnvelopeSignature } from "./signature";

export { parseEnvelope, validateEnvelope } from "./validate";
