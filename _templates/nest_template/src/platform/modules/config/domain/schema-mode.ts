export const ALLOWED_SCHEMA_MODES = [
  'ok',
  'dirty',
  'checksum_mismatch',
  'missing_version',
  'db_down',
] as const

export type SchemaModeType = (typeof ALLOWED_SCHEMA_MODES)[number]
