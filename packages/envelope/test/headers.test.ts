import { describe, expect, it } from "vitest";

import { createEvent } from "../src/factories";
import { fromHeaders, injectTraceFromOtel, toHeaders } from "../src/headers";

describe("headers helpers", () => {
  it("round-trips context through headers", () => {
    const envelope = createEvent({
      type: "order.created",
      source: "svc.orders",
      correlation_id: "corr-1",
      causation_id: "cause-1",
      tenant_id: "tenant-1",
      traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
      tracestate: "vendor=abc",
      data: { orderId: "1" },
    });

    const headers = toHeaders(envelope);
    const parsed = fromHeaders(headers);

    expect(parsed).toEqual({
      traceparent: envelope.traceparent,
      tracestate: envelope.tracestate,
      correlation_id: envelope.correlation_id,
      causation_id: envelope.causation_id,
      tenant_id: envelope.tenant_id,
    });
  });

  it("supports native Headers input", () => {
    const headers = new Headers();
    headers.set("X-Correlation-Id", "corr-2");
    headers.set("traceparent", "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01");

    const parsed = fromHeaders(headers);
    expect(parsed.correlation_id).toBe("corr-2");
    expect(parsed.traceparent).toBe("00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01");
  });

  it("supports array and nullable header values", () => {
    const parsed = fromHeaders({
      "x-correlation-id": ["corr-a", "corr-b"],
      "x-causation-id": null,
      "x-tenant-id": undefined,
    });

    expect(parsed.correlation_id).toBe("corr-a,corr-b");
    expect(parsed.causation_id).toBeUndefined();
    expect(parsed.tenant_id).toBeUndefined();
  });

  it("does not throw when OpenTelemetry API is absent", () => {
    expect(() => injectTraceFromOtel()).not.toThrow();
    expect(injectTraceFromOtel()).toEqual(expect.any(Object));
  });
});
