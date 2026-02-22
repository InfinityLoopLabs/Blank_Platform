import { normalizeEnvelope } from "./normalize";
import type { CreateEnvelopeInput, CreateErrorReplyInput, MessageEnvelope } from "./types";

export function createEvent<TData>(input: CreateEnvelopeInput<TData>): MessageEnvelope<TData> {
  return normalizeEnvelope(input);
}

export function createCommand<TData>(input: CreateEnvelopeInput<TData>): MessageEnvelope<TData> {
  return normalizeEnvelope(input);
}

export function createReply<TData>(input: CreateEnvelopeInput<TData>): MessageEnvelope<TData> {
  return normalizeEnvelope(input);
}

export function createErrorReply(
  input: CreateErrorReplyInput,
): MessageEnvelope<{ code: string; message: string; details?: unknown }> {
  return normalizeEnvelope({
    ...input,
    type: input.type ?? "error.reply",
    data: {
      code: input.code,
      message: input.message,
      details: input.details,
    },
  });
}
