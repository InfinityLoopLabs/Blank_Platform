import type { EnvelopeHeaderContext, HeadersLike, MessageEnvelope } from "./types";

function normalizeHeaderEntries(headers: HeadersLike): Array<[string, string]> {
  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    const items: Array<[string, string]> = [];
    headers.forEach((value, key) => {
      items.push([key.toLowerCase(), String(value)]);
    });
    return items;
  }

  if (Array.isArray(headers)) {
    return headers.map(([key, value]) => [key.toLowerCase(), String(value)]);
  }

  return Object.entries(headers).flatMap(([key, value]) => {
    if (value === undefined || value === null) {
      return [];
    }

    if (Array.isArray(value)) {
      return [[key.toLowerCase(), value.join(",")]];
    }

    return [[key.toLowerCase(), String(value)]];
  });
}

function getHeader(map: Map<string, string>, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = map.get(name.toLowerCase());
    if (value) {
      return value;
    }
  }

  return undefined;
}

function trimOrUndefined(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function fromHeaders(headers: HeadersLike): EnvelopeHeaderContext {
  const map = new Map(normalizeHeaderEntries(headers));

  return {
    traceparent: trimOrUndefined(getHeader(map, "traceparent")),
    tracestate: trimOrUndefined(getHeader(map, "tracestate")),
    correlation_id: trimOrUndefined(getHeader(map, "x-correlation-id", "correlation-id", "correlation_id")),
    causation_id: trimOrUndefined(getHeader(map, "x-causation-id", "causation-id", "causation_id")),
    tenant_id: trimOrUndefined(getHeader(map, "x-tenant-id", "tenant-id", "tenant_id")),
  };
}

export function toHeaders<TData>(envelope: MessageEnvelope<TData>): Record<string, string> {
  const headers: Record<string, string> = {
    "x-correlation-id": envelope.correlation_id,
    "x-idempotency-key": envelope.idempotency_key,
    "x-envelope-id": envelope.id,
    "x-envelope-type": envelope.type,
    "x-envelope-source": envelope.source,
  };

  if (envelope.traceparent) {
    headers.traceparent = envelope.traceparent;
  }

  if (envelope.tracestate) {
    headers.tracestate = envelope.tracestate;
  }

  if (envelope.causation_id) {
    headers["x-causation-id"] = envelope.causation_id;
  }

  if (envelope.tenant_id) {
    headers["x-tenant-id"] = envelope.tenant_id;
  }

  return headers;
}

function loadOpenTelemetryApi(): any {
  try {
    const dynamicRequire = (0, eval)("require") as (id: string) => unknown;
    return dynamicRequire("@opentelemetry/api");
  } catch {
    return undefined;
  }
}

export function injectTraceFromOtel(): Pick<EnvelopeHeaderContext, "traceparent" | "tracestate"> {
  try {
    const api = loadOpenTelemetryApi();
    const activeSpan = api?.trace?.getActiveSpan?.();
    const spanContext = activeSpan?.spanContext?.();

    const traceId = spanContext?.traceId;
    const spanId = spanContext?.spanId;

    if (!traceId || !spanId) {
      return {};
    }

    const traceFlags = Number(spanContext.traceFlags ?? 1)
      .toString(16)
      .padStart(2, "0");

    const traceparent = `00-${traceId}-${spanId}-${traceFlags}`;
    const tracestate = spanContext.traceState?.serialize?.();

    return tracestate ? { traceparent, tracestate } : { traceparent };
  } catch {
    return {};
  }
}
