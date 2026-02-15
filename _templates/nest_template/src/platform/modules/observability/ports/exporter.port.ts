import { ObservabilityEvent } from '../domain/observability-event';

export interface ObservabilityExporter {
  export(event: ObservabilityEvent): Promise<boolean>;
}
