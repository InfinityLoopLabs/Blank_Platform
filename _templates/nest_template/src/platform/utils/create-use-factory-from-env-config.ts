/**
 * Creates a Nest `useFactory` callback that receives typed env-config as first injected dependency.
 *
 * Responsibility:
 * - Keep module config factories small and readable.
 * - Remove repetitive casting from `(...args: unknown[])` to concrete env repository type.
 *
 * Contract:
 * - The first entry in module `inject` MUST be env-config provider token.
 * - The provided mapper must be a pure transform: `env -> module options`.
 *
 * Why this exists:
 * - `registerAsync` in many connector modules expects a variadic `useFactory(...args)`.
 * - In practice, we inject one primary env-config dependency (`CONFIG_REPOSITORY`) first.
 * - This helper centralizes that adaptation in one explicit place.
 *
 * Example:
 * ```ts
 * PostgresConnectorModule.registerAsync({
 *   imports: [ConfigModule],
 *   inject: [CONFIG_REPOSITORY],
 *   useFactory: createUseFactoryFromEnvConfig(buildPostgresConnectorOptions),
 * })
 * ```
 */
export function createUseFactoryFromEnvConfig<TEnvConfig, TResult>(
  mapper: (envConfig: TEnvConfig) => TResult,
): (...args: unknown[]) => TResult {
  return (...args: unknown[]): TResult => mapper(args[0] as TEnvConfig)
}
