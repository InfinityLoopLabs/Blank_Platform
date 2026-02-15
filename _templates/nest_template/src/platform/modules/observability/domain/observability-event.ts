export type ObservabilityEvent = {
  event: string;
  fields: Record<string, unknown>;
  timestamp: string;
  serviceName: string;
  environment: string;
};

export type ObservabilitySnapshot = {
  endpoint: string;
  isSidecarUp: boolean;
  sentEvents: number;
  droppedEvents: number;
};
