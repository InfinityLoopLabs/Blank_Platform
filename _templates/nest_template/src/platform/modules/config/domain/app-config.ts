import { SchemaModeType } from './schema-mode'

export type AppConfigType = {
  appEnv: string
  appPort: number
  schemaMode: SchemaModeType
  otelSidecarEndpoint: string
  isOtelSidecarAvailable: boolean
}
