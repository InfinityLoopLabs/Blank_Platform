import { ObservabilityEventType } from '../domain/observability-event'
import { IObservabilityExporter } from '../ports/exporter.port'

export class NoopExporter implements IObservabilityExporter {
  async export(event: ObservabilityEventType): Promise<boolean> {
    void event

    return false
  }
}
