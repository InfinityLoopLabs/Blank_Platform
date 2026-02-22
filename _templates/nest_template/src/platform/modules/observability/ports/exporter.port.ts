import { ObservabilityEventType } from '../domain/observability-event'

export interface IObservabilityExporter {
  export(event: ObservabilityEventType): Promise<boolean>
}
