# Transport Mapping (HTTP / gRPC)

This mapping keeps one envelope contract regardless of transport.

## HTTP headers
- `traceparent` <- `envelope.traceparent`
- `tracestate` <- `envelope.tracestate`
- `x-correlation-id` <- `envelope.correlation_id`
- `x-causation-id` <- `envelope.causation_id`
- `x-tenant-id` <- `envelope.tenant_id`
- `x-idempotency-key` <- `envelope.idempotency_key`
- `x-envelope-id` <- `envelope.id`
- `x-envelope-type` <- `envelope.type`
- `x-envelope-source` <- `envelope.source`

## gRPC metadata
Use the same key names as lowercase metadata keys:
- `traceparent`, `tracestate`
- `x-correlation-id`, `x-causation-id`, `x-tenant-id`
- `x-idempotency-key`, `x-envelope-id`, `x-envelope-type`, `x-envelope-source`

## Payload transport
- HTTP: JSON body with full `MessageEnvelope`.
- gRPC: `MessageEnvelope` proto message.
- For typed `data`, keep `type` + `dataschema` aligned with consumer schemas.
