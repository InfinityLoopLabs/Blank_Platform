import { describe, expect, it } from "vitest";

import { createEvent } from "../src/factories";
import { EnvelopeSerializationError } from "../src/errors";
import { parseEnvelope, validateEnvelope } from "../src/validate";

describe("validate edge cases", () => {
  it("collects security and format issues", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { id: 1 },
    });

    const invalid = {
      ...envelope,
      specversion: "2.0",
      id: "",
      datacontenttype: "",
      correlation_id: "",
      idempotency_key: "",
      retry_count: -2,
      ttl_sec: 0,
      traceparent: "bad",
      actor: {
        sub: "",
        scopes: ["b", "a", "a"],
      },
      auth_context: {
        method: "INVALID",
        token_ref: "Bearer very-secret-token",
      },
      signature: {
        alg: "INVALID",
        kid: "",
        value: "",
      },
    } as any;

    const result = validateEnvelope(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const paths = result.errors.map((error) => error.path);
      expect(paths).toEqual(
        expect.arrayContaining([
          "specversion",
          "id",
          "datacontenttype",
          "correlation_id",
          "idempotency_key",
          "retry_count",
          "ttl_sec",
          "traceparent",
          "actor.sub",
          "actor.scopes",
          "auth_context.method",
          "auth_context.token_ref",
          "signature.alg",
          "signature.kid",
          "signature.value",
        ]),
      );
    }
  });

  it("accepts parseEnvelope and returns normalized defaults", () => {
    const parsed = parseEnvelope({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "1" },
    });

    expect(parsed.specversion).toBe("1.0");
    expect(parsed.retry_count).toBe(0);
  });

  it("wraps unexpected normalize errors as serialization error", () => {
    const brokenInput = {};
    Object.defineProperty(brokenInput, "type", {
      get() {
        throw new Error("boom");
      },
    });

    expect(() => parseEnvelope(brokenInput)).toThrow(EnvelopeSerializationError);
  });

  it("rejects non-http dataschema protocol", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      dataschema: "https://example.com/schema",
      data: {},
    });

    const result = validateEnvelope({
      ...envelope,
      dataschema: "ftp://example.com/schema",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((error) => error.path === "dataschema")).toBe(true);
    }
  });
});
