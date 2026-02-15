import { ObservabilityEvent } from '../domain/observability-event';
import { ObservabilityExporter } from '../ports/exporter.port';

export class NoopExporter implements ObservabilityExporter {
  async export(_event: ObservabilityEvent): Promise<boolean> {
    return false;
  }
}
