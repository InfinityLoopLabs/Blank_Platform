import { describe, expect, it } from "vitest";

import { createEvent } from "../src/factories";
import { EnvelopeSerializationError, EnvelopeValidationError } from "../src/errors";
import { parseEnvelope, validateEnvelope } from "../src/validate";

describe("validateEnvelope", () => {
  it("returns ok for valid envelope", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      dataschema: "https://example.com/schemas/order-created.json",
      data: { orderId: "1" },
    });

    expect(validateEnvelope(envelope)).toEqual({ ok: true });
  });

  it("returns issues for invalid envelope", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "1" },
    });

    const invalid = {
      ...envelope,
      type: "OrderCreated",
      source: "SvcOrders",
      time: "2024-13-01",
      dataschema: "not-url",
    };

    const result = validateEnvelope(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.path)).toEqual(
        expect.arrayContaining(["type", "source", "time", "dataschema"]),
      );
    }
  });

  it("parseEnvelope throws typed validation error", () => {
    expect(() =>
      parseEnvelope({
        type: "BadType",
        source: "svc.orders",
        data: {},
      }),
    ).toThrow(EnvelopeValidationError);
  });

  it("parseEnvelope throws serialization error for non object", () => {
    expect(() => parseEnvelope("hello")).toThrow(EnvelopeSerializationError);
  });
});
