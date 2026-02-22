import { createHmac, sign, timingSafeEqual, verify } from "node:crypto";
import type { KeyObject } from "node:crypto";

import { EnvelopeSecurityError, EnvelopeValidationError } from "./errors";
import { canonicalJson } from "./normalize";
import { validateEnvelope } from "./validate";
import type { KeyLike, MessageEnvelope, SignatureBlock, SignerConfig, VerifierConfig } from "./types";

function decodeBase64Flexible(value: string): Buffer {
  try {
    return Buffer.from(value, "base64url");
  } catch {
    return Buffer.from(value, "base64");
  }
}

function encodeSignature(value: Buffer, encoding: "base64" | "base64url"): string {
  return value.toString(encoding);
}

function canonicalEnvelopePayload<TData>(envelope: MessageEnvelope<TData>): string {
  const { signature, ...unsignedEnvelope } = envelope;
  return canonicalJson(unsignedEnvelope);
}

function resolveKey(config: VerifierConfig, kid: string, alg: SignatureBlock["alg"]): KeyLike | undefined {
  if (config.getKey) {
    return config.getKey(kid, alg);
  }

  return config.keysByKid?.[kid];
}

function isAllowedAlgorithm(config: VerifierConfig, alg: SignatureBlock["alg"]): boolean {
  if (!config.allowedAlgorithms || config.allowedAlgorithms.length === 0) {
    return true;
  }

  return config.allowedAlgorithms.includes(alg);
}

function asHmacSecret(input: KeyLike): Buffer {
  if (typeof input === "string") {
    return Buffer.from(input, "utf8");
  }

  if (Buffer.isBuffer(input)) {
    return input;
  }

  if (input instanceof Uint8Array) {
    return Buffer.from(input);
  }

  throw new EnvelopeSecurityError("HS256 requires secret as string or bytes");
}

function asNodeKey(input: KeyLike): string | Buffer | KeyObject {
  if (typeof input === "string") {
    return input;
  }

  if (Buffer.isBuffer(input)) {
    return input;
  }

  if (input instanceof Uint8Array) {
    return Buffer.from(input);
  }

  return input;
}

export function signEnvelope<TData>(envelope: MessageEnvelope<TData>, signerConfig: SignerConfig): MessageEnvelope<TData> {
  const validation = validateEnvelope(envelope);
  if (!validation.ok) {
    throw new EnvelopeValidationError("Cannot sign invalid envelope", validation.errors);
  }

  const payload = Buffer.from(canonicalEnvelopePayload(envelope), "utf8");
  const outputEncoding = signerConfig.outputEncoding ?? "base64url";

  let signatureBuffer: Buffer;
  if (signerConfig.alg === "EdDSA") {
    signatureBuffer = sign(null, payload, asNodeKey(signerConfig.privateKey));
  } else if (signerConfig.alg === "ES256") {
    signatureBuffer = sign("sha256", payload, asNodeKey(signerConfig.privateKey));
  } else if (signerConfig.alg === "HS256") {
    signatureBuffer = createHmac("sha256", asHmacSecret(signerConfig.secret)).update(payload).digest();
  } else {
    throw new EnvelopeSecurityError(`Unsupported signature algorithm: ${(signerConfig as { alg: string }).alg}`);
  }

  return {
    ...envelope,
    signature: {
      alg: signerConfig.alg,
      kid: signerConfig.kid.trim(),
      value: encodeSignature(signatureBuffer, outputEncoding),
    },
  };
}

export function verifyEnvelopeSignature<TData>(envelope: MessageEnvelope<TData>, verifierConfig: VerifierConfig): boolean {
  try {
    const signature = envelope.signature;
    if (!signature) {
      return false;
    }

    if (!isAllowedAlgorithm(verifierConfig, signature.alg)) {
      return false;
    }

    const verificationKey = resolveKey(verifierConfig, signature.kid, signature.alg);
    if (!verificationKey) {
      return false;
    }

    const payload = Buffer.from(canonicalEnvelopePayload(envelope), "utf8");
    const signatureBuffer = decodeBase64Flexible(signature.value);

    if (signature.alg === "EdDSA") {
      return verify(null, payload, asNodeKey(verificationKey), signatureBuffer);
    }

    if (signature.alg === "ES256") {
      return verify("sha256", payload, asNodeKey(verificationKey), signatureBuffer);
    }

    if (signature.alg === "HS256") {
      const expected = createHmac("sha256", asHmacSecret(verificationKey)).update(payload).digest();
      if (expected.length !== signatureBuffer.length) {
        return false;
      }
      return timingSafeEqual(expected, signatureBuffer);
    }

    return false;
  } catch {
    return false;
  }
}
