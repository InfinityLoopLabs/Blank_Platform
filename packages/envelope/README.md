# @infinityloop.labs/envelope

Unified message envelope contract for Go, Python, JavaScript/TypeScript and any transport (HTTP, gRPC, Kafka, NATS).

## Contract-first assets
- JSON Schema: `contract/envelope.schema.json`
- Protobuf: `contract/envelope.proto`
- HTTP/gRPC header mapping: `contract/transport-mapping.md`

## Quick start

```bash
npm i @infinityloop.labs/envelope
```

```ts
import { createEvent, createCommand, createReply } from "@infinityloop.labs/envelope";

const event = createEvent({
  type: "order.created",
  source: "svc.orders",
  subject: "order/123",
  data: { orderId: "123", amount: 100 },
});

const command = createCommand({
  type: "order.capture",
  source: "svc.payments",
  correlation_id: event.correlation_id,
  causation_id: event.id,
  data: { orderId: "123" },
});

const reply = createReply({
  type: "order.captured",
  source: "svc.payments",
  correlation_id: command.correlation_id,
  causation_id: command.id,
  data: { orderId: "123", status: "ok" },
});
```

## Factories

```ts
import { createErrorReply } from "@infinityloop.labs/envelope";

const errorReply = createErrorReply({
  source: "svc.payments",
  correlation_id: "corr-1",
  causation_id: "msg-1",
  code: "PAYMENT_DECLINED",
  message: "Card was declined",
  details: { reason: "insufficient_funds" },
});
```

## Validation and parsing

```ts
import { parseEnvelope, validateEnvelope } from "@infinityloop.labs/envelope";

const parsed = parseEnvelope(JSON.parse(rawBody)); // throws typed error
const result = validateEnvelope(parsed);
if (!result.ok) {
  console.error(result.errors);
}
```

## Signing and verification

```ts
import { generateKeyPairSync } from "node:crypto";
import { signEnvelope, verifyEnvelopeSignature } from "@infinityloop.labs/envelope";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");

const signed = signEnvelope(event, {
  alg: "EdDSA",
  kid: "key-1",
  privateKey,
});

const isValid = verifyEnvelopeSignature(signed, {
  keysByKid: {
    "key-1": publicKey.export({ type: "spki", format: "pem" }),
  },
});
```

## HTTP, Kafka, NATS headers

```ts
import { fromHeaders, toHeaders } from "@infinityloop.labs/envelope";

const headers = toHeaders(event);

// HTTP: set response/request headers from this object.
// Kafka: map entries to message headers (Buffer/string by client policy).
// NATS: map entries into nats headers metadata.

const context = fromHeaders(headers);
```

## OpenTelemetry helper

```ts
import { injectTraceFromOtel } from "@infinityloop.labs/envelope";

const traceCtx = injectTraceFromOtel();
// returns {} if OTel API is not installed or no active span exists
```

## Security notes
- Raw tokens are forbidden in `auth_context.token_ref`.
- Store only references (`token_ref`) to secrets/tokens.
- Signature is computed from canonical JSON **without** the `signature` field.

## Field reference

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `specversion` | `"1.0"` | yes | Envelope spec version |
| `id` | `string` | yes | Unique message id (ULID by default) |
| `type` | `string` | yes | Domain event/command/reply type |
| `source` | `string` | yes | Producer service id |
| `subject` | `string` | no | Resource subject (e.g. `order/123`) |
| `time` | `string` | yes | ISO-8601 UTC timestamp |
| `datacontenttype` | `string` | yes | Payload content type (`application/json` default) |
| `dataschema` | `string` URL | no | Payload schema URL |
| `traceparent` | `string` | no | W3C trace context |
| `tracestate` | `string` | no | W3C trace state |
| `correlation_id` | `string` | yes | Business flow id |
| `causation_id` | `string` | no | Parent message id |
| `tenant_id` | `string` | no | Tenant identifier |
| `actor` | object | no | Initiator context (`sub`, `act`, `scopes`) |
| `auth_context` | object | no | Auth method and token reference |
| `idempotency_key` | `string` | yes | Deterministic idempotency key |
| `ttl_sec` | `number` | no | Message TTL (>0) |
| `retry_count` | `number` | yes | Retry attempts counter (>=0) |
| `signature` | object | no | Signature block (`alg`, `kid`, `value`) |
| `data` | `unknown` | yes | Business payload |

## Public API

- Factories: `createEvent`, `createCommand`, `createReply`, `createErrorReply`
- Validation: `validateEnvelope`, `parseEnvelope`
- Normalization: `normalizeEnvelope`
- Headers/Trace: `fromHeaders`, `toHeaders`, `injectTraceFromOtel`
- Signature: `signEnvelope`, `verifyEnvelopeSignature`
- Errors: `EnvelopeValidationError`, `EnvelopeSecurityError`, `EnvelopeSerializationError`
- Types: all envelope-related public interfaces and config types
