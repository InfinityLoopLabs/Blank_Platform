import { describe, expect, it } from "vitest";

import { EnvelopeSecurityError, EnvelopeValidationError } from "../src/errors";
import { canonicalJson, deriveDeterministicIdempotencyKey, normalizeEnvelope } from "../src/normalize";

describe("normalizeEnvelope", () => {
  it("trims string fields and normalizes scopes", () => {
    const envelope = normalizeEnvelope({
      type: "  order.created ",
      source: " svc.orders ",
      correlation_id: " corr-1 ",
      actor: {
        sub: " user-1 ",
        act: " gateway ",
        scopes: ["b", "a", "a", "  c  "],
      },
      data: { x: 1 },
    });

    expect(envelope.type).toBe("order.created");
    expect(envelope.source).toBe("svc.orders");
    expect(envelope.correlation_id).toBe("corr-1");
    expect(envelope.actor?.sub).toBe("user-1");
    expect(envelope.actor?.act).toBe("gateway");
    expect(envelope.actor?.scopes).toEqual(["a", "b", "c"]);
  });

  it("enforces integer rules for retry_count and ttl_sec", () => {
    expect(() =>
      normalizeEnvelope({
        type: "order.created",
        source: "svc.orders",
        retry_count: -1,
        data: {},
      }),
    ).toThrow(EnvelopeValidationError);

    expect(() =>
      normalizeEnvelope({
        type: "order.created",
        source: "svc.orders",
        ttl_sec: 0,
        data: {},
      }),
    ).toThrow(EnvelopeValidationError);
  });

  it("requires source and data fields", () => {
    expect(() =>
      normalizeEnvelope({
        type: "order.created",
      } as any),
    ).toThrow(EnvelopeValidationError);

    expect(() =>
      normalizeEnvelope({
        source: "svc.orders",
        data: {},
      } as any),
    ).toThrow(EnvelopeValidationError);
  });

  it("blocks raw token in token_ref", () => {
    expect(() =>
      normalizeEnvelope({
        type: "order.created",
        source: "svc.orders",
        auth_context: {
          method: "JWT",
          token_ref: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature",
        },
        data: {},
      }),
    ).toThrow(EnvelopeSecurityError);
  });

  it("keeps auth_context with token reference", () => {
    const envelope = normalizeEnvelope({
      type: "order.created",
      source: "svc.orders",
      auth_context: {
        method: "JWT",
        token_ref: " token://vault/abc ",
      },
      data: {},
    });

    expect(envelope.auth_context).toEqual({
      method: "JWT",
      token_ref: "token://vault/abc",
    });
  });

  it("creates deterministic idempotency key", () => {
    const keyA = deriveDeterministicIdempotencyKey({
      type: "order.created",
      source: "svc.orders",
      subject: "order/123",
      correlation_id: "corr-1",
      data: { amount: 10 },
    });

    const keyB = deriveDeterministicIdempotencyKey({
      type: "order.created",
      source: "svc.orders",
      subject: "order/123",
      correlation_id: "corr-1",
      data: { amount: 10 },
    });

    const keyC = deriveDeterministicIdempotencyKey({
      type: "order.created",
      source: "svc.orders",
      subject: "order/123",
      correlation_id: "corr-1",
      data: { amount: 11 },
    });

    expect(keyA).toBe(keyB);
    expect(keyA).not.toBe(keyC);
  });

  it("canonicalizes objects stably", () => {
    const value = {
      z: 1,
      a: {
        y: 2,
        x: 1,
      },
      arr: [2, 1, undefined],
      omit: undefined,
    };

    expect(canonicalJson(value)).toBe('{"a":{"x":1,"y":2},"arr":[2,1,null],"z":1}');
  });

  it("validates signature normalization", () => {
    expect(() =>
      normalizeEnvelope({
        type: "order.created",
        source: "svc.orders",
        signature: {
          alg: "EdDSA",
          kid: "",
          value: "abc",
        },
        data: {},
      }),
    ).toThrow(EnvelopeValidationError);
  });
});
