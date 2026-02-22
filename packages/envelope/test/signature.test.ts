import { generateKeyPairSync } from "node:crypto";

import { describe, expect, it } from "vitest";

import { createEvent } from "../src/factories";
import { EnvelopeValidationError } from "../src/errors";
import { signEnvelope, verifyEnvelopeSignature } from "../src/signature";

describe("signature", () => {
  it("signs and verifies envelope with EdDSA", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");

    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "1" },
    });

    const signed = signEnvelope(envelope, {
      alg: "EdDSA",
      kid: "ed1",
      privateKey,
    });

    expect(signed.signature?.alg).toBe("EdDSA");
    expect(verifyEnvelopeSignature(signed, { keysByKid: { ed1: publicKey.export({ type: "spki", format: "pem" }) } })).toBe(
      true,
    );
  });

  it("signs and verifies envelope with ES256", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ec", {
      namedCurve: "P-256",
    });

    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "2" },
    });

    const signed = signEnvelope(envelope, {
      alg: "ES256",
      kid: "es1",
      privateKey,
    });

    expect(verifyEnvelopeSignature(signed, { keysByKid: { es1: publicKey.export({ type: "spki", format: "pem" }) } })).toBe(
      true,
    );
  });

  it("fails verification after tampering", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");

    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "3" },
    });

    const signed = signEnvelope(envelope, {
      alg: "EdDSA",
      kid: "ed2",
      privateKey,
    });

    const tampered = {
      ...signed,
      data: { orderId: "4" },
    };

    expect(verifyEnvelopeSignature(tampered, { keysByKid: { ed2: publicKey.export({ type: "spki", format: "pem" }) } })).toBe(
      false,
    );
  });

  it("supports HS256", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "5" },
    });

    const signed = signEnvelope(envelope, {
      alg: "HS256",
      kid: "hs1",
      secret: "super-secret",
    });

    expect(verifyEnvelopeSignature(signed, { keysByKid: { hs1: "super-secret" } })).toBe(true);
    expect(verifyEnvelopeSignature(signed, { keysByKid: { hs1: "wrong-secret" } })).toBe(false);
  });

  it("returns false when algorithm is disallowed or key is missing", () => {
    const { privateKey } = generateKeyPairSync("ed25519");

    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "6" },
    });

    const signed = signEnvelope(envelope, {
      alg: "EdDSA",
      kid: "ed4",
      privateKey,
    });

    expect(verifyEnvelopeSignature(signed, { allowedAlgorithms: ["ES256"], keysByKid: { ed4: "ignored" } })).toBe(false);
    expect(verifyEnvelopeSignature(signed, { keysByKid: {} })).toBe(false);
  });

  it("returns false for malformed signature payloads", () => {
    const malformed = {
      ...createEvent({
        type: "order.created",
        source: "svc.orders",
        data: { orderId: "7" },
      }),
      signature: {
        alg: "UNKNOWN" as any,
        kid: "k1",
        value: "***",
      },
    };

    expect(verifyEnvelopeSignature(malformed, { keysByKid: { k1: "secret" } })).toBe(false);
  });

  it("returns false on HS256 length mismatch", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "8" },
    });

    const signed = signEnvelope(envelope, {
      alg: "HS256",
      kid: "hs2",
      secret: "top-secret",
    });

    const tampered = {
      ...signed,
      signature: {
        ...signed.signature!,
        value: "AA",
      },
    };

    expect(verifyEnvelopeSignature(tampered, { keysByKid: { hs2: "top-secret" } })).toBe(false);
  });

  it("returns false when crypto verification throws", () => {
    const { privateKey } = generateKeyPairSync("ed25519");
    const signed = signEnvelope(
      createEvent({
        type: "order.created",
        source: "svc.orders",
        data: { orderId: "9" },
      }),
      { alg: "EdDSA", kid: "ed5", privateKey },
    );

    expect(verifyEnvelopeSignature(signed, { keysByKid: { ed5: new Uint8Array([1, 2, 3]) } })).toBe(false);
  });

  it("throws for invalid envelope signing", () => {
    const { privateKey } = generateKeyPairSync("ed25519");

    const invalidEnvelope = {
      ...createEvent({
        type: "order.created",
        source: "svc.orders",
        data: { orderId: "1" },
      }),
      type: "BadType",
    };

    expect(() => signEnvelope(invalidEnvelope, { alg: "EdDSA", kid: "ed3", privateKey })).toThrow(EnvelopeValidationError);
  });
});
