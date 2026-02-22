import { describe, expect, it } from "vitest";

import { createCommand, createErrorReply, createEvent, createReply } from "../src/factories";
import { SPEC_VERSION } from "../src/schemas";

describe("factories", () => {
  it("applies defaults for event", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      data: { orderId: "123" },
    });

    expect(envelope.specversion).toBe(SPEC_VERSION);
    expect(envelope.id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(envelope.correlation_id).toBe(envelope.id);
    expect(envelope.datacontenttype).toBe("application/json");
    expect(envelope.retry_count).toBe(0);
    expect(envelope.idempotency_key).toMatch(/^sha256:/);
    expect(new Date(envelope.time).toISOString()).toBe(envelope.time);
  });

  it("normalizes command and reply fields", () => {
    const command = createCommand({
      type: "order.submit",
      source: "svc.checkout",
      subject: "  order/1  ",
      correlation_id: "  corr-1  ",
      retry_count: 2,
      data: { amount: 10 },
    });

    const reply = createReply({
      type: "order.submitted",
      source: "svc.orders",
      correlation_id: command.correlation_id,
      causation_id: command.id,
      data: { status: "ok" },
    });

    expect(command.subject).toBe("order/1");
    expect(command.correlation_id).toBe("corr-1");
    expect(command.retry_count).toBe(2);
    expect(reply.correlation_id).toBe("corr-1");
    expect(reply.causation_id).toBe(command.id);
  });

  it("creates error reply with default type", () => {
    const envelope = createErrorReply({
      source: "svc.orders",
      correlation_id: "corr-2",
      code: "ORDER_NOT_FOUND",
      message: "Order is missing",
      details: { id: "123" },
    });

    expect(envelope.type).toBe("error.reply");
    expect(envelope.data.code).toBe("ORDER_NOT_FOUND");
    expect(envelope.data.message).toBe("Order is missing");
    expect(envelope.data.details).toEqual({ id: "123" });
  });
});
