import { Injectable } from '@nestjs/common'

import { NoopExporter } from '../adapters/noop-exporter'
import {
  ObservabilityEventType,
  ObservabilitySnapshotType,
} from '../domain/observability-event'
import { IObservabilityExporter } from '../ports/exporter.port'

@Injectable()
export class ObservabilityService {
  private sentEvents = 0
  private droppedEvents = 0
  private readonly buffer: ObservabilityEventType[] = []

  constructor(
    private readonly endpoint: string,
    private readonly isSidecarUp: boolean,
    private readonly serviceName: string,
    private readonly environment: string,
    private readonly exporter: IObservabilityExporter = new NoopExporter(),
  ) {}

  emit(event: string, fields: Record<string, unknown>): void {
    if (!this.isSidecarUp) {
      this.droppedEvents += 1

      return
    }
    if (this.buffer.length >= 128) {
      this.droppedEvents += 1

      return
    }

    const entry: ObservabilityEventType = {
      event,
      fields,
      timestamp: new Date().toISOString(),
      serviceName: this.serviceName,
      environment: this.environment,
    }

    this.buffer.push(entry)
    this.sentEvents += 1

    void this.exporter
      .export(entry)
      .then(isExported => {
        if (!isExported) {
          this.droppedEvents += 1
        }
        this.release(entry)
      })
      .catch(() => {
        this.droppedEvents += 1
        this.release(entry)
      })
  }

  log(
    level: string,
    message: string,
    fields: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      environment: this.environment,
      ...fields,
    }
  }

  snapshot(): ObservabilitySnapshotType {
    return {
      endpoint: this.endpoint,
      isSidecarUp: this.isSidecarUp,
      sentEvents: this.sentEvents,
      droppedEvents: this.droppedEvents,
    }
  }

  private release(entry: ObservabilityEventType): void {
    const index = this.buffer.indexOf(entry)
    if (index >= 0) {
      this.buffer.splice(index, 1)
    }
  }
}
