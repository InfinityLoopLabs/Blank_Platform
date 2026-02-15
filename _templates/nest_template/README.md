# NestJS Template (Reference Slice)

## Structure

- `src/features/sample/domain`
- `src/features/sample/application`
- `src/features/sample/ports`
- `src/features/sample/adapters`
- `src/features/sample/transport`
- `src/platform/*` for cross-cutting technical modules
- `src/platform/transport/http` canonical HTTP request flow primitives
- `src/platform/transport/grpc` gRPC transport scaffold
- `src/platform/modules/config/{domain,application,ports,adapters,transport}` for replaceable app config source (`env`, `server`, etc.)
- `src/platform/modules/integration-policy/{domain,application,transport}` for integration capabilities config (postgres/kafka/redis/... flags + endpoints)
- `src/platform/modules/observability/{domain,application,ports,adapters,transport}` for sidecar-only OTLP export
- `src/platform/modules/health/{domain,application,transport}` for health/readiness/health status module

## Notes

Nest wiring uses framework-native DI and middleware primitives:

- `AppModule` providers for IoC
- middleware, guards, pipes, interceptors, exception filter
- unified response envelope via `ResponseFactory`

## Commands

```bash
cd templates/nest
npm install
npm run build
npm run start
npm run test:domain
```
