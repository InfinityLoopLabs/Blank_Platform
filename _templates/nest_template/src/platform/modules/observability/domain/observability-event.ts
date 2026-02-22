export type ObservabilityEventType = {
  event: string
  fields: Record<string, unknown>
  timestamp: string
  serviceName: string
  environment: string
}

export type ObservabilitySnapshotType = {
  endpoint: string
  isSidecarUp: boolean
  sentEvents: number
  droppedEvents: number
}
