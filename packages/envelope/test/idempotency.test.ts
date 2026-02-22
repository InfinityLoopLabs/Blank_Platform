import { describe, expect, it } from "vitest";

import { createEvent } from "../src/factories";

describe("idempotency key", () => {
  it("is deterministic for same normalized business payload", () => {
    const a = createEvent({
      type: "order.created",
      source: "svc.orders",
      subject: "order/100",
      correlation_id: "corr-100",
      data: { amount: 50, currency: "USD" },
    });

    const b = createEvent({
      type: "order.created",
      source: "svc.orders",
      subject: "order/100",
      correlation_id: "corr-100",
      data: { amount: 50, currency: "USD" },
    });

    expect(a.id).not.toBe(b.id);
    expect(a.idempotency_key).toBe(b.idempotency_key);
  });

  it("changes when relevant fields change", () => {
    const a = createEvent({
      type: "order.created",
      source: "svc.orders",
      subject: "order/100",
      correlation_id: "corr-100",
      data: { amount: 50 },
    });

    const b = createEvent({
      type: "order.updated",
      source: "svc.orders",
      subject: "order/100",
      correlation_id: "corr-100",
      data: { amount: 50 },
    });

    expect(a.idempotency_key).not.toBe(b.idempotency_key);
  });
});
