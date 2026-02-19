import { IncomingHttpHeaders } from 'http';

export type TransportProtocol = 'http' | 'grpc' | 'ws' | 'unknown';

export type RequestContext = {
  protocol: TransportProtocol;
  requestId: string;
  correlationId: string;
  traceId: string;
  spanId: string;
  userId: string;
  isAuthenticated: boolean;
  canCreateSample: boolean;
};

export type GrpcMetadataLike = {
  get?: (key: string) => unknown[];
  getMap?: () => Record<string, unknown>;
};

function randomHex(length: number): string {
  const alphabet = 'abcdef0123456789';
  let value = '';
  for (let index = 0; index < length; index += 1) {
    const alphabetIndex = Math.floor(Math.random() * alphabet.length);
    value += alphabet[alphabetIndex];
  }
  return value;
}

function normalize(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Buffer.isBuffer(value)) {
    return value.toString('utf8').trim();
  }
  return '';
}

function readHttpHeader(headers: IncomingHttpHeaders, key: string): string {
  const raw = headers[key];
  if (Array.isArray(raw)) {
    return normalize(raw[0]);
  }
  return normalize(raw);
}

function readGrpcHeader(metadata: GrpcMetadataLike, key: string): string {
  if (metadata.get) {
    const values = metadata.get(key);
    if (values.length > 0) {
      return normalize(values[0]);
    }
  }

  if (metadata.getMap) {
    const map = metadata.getMap();
    const direct = normalize(map[key]);
    if (direct.length > 0) {
      return direct;
    }
    return normalize(map[key.toLowerCase()]);
  }

  return '';
}

function parseBoolean(value: string): boolean {
  return value.toLowerCase() === 'true';
}

export function isGrpcMetadataLike(value: unknown): value is GrpcMetadataLike {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'get' in value || 'getMap' in value;
}

export function buildHttpRequestContext(headers: IncomingHttpHeaders): RequestContext {
  const userId = readHttpHeader(headers, 'x-user-id');

  return {
    protocol: 'http',
    requestId: readHttpHeader(headers, 'x-request-id') || randomHex(16),
    correlationId: readHttpHeader(headers, 'x-correlation-id') || randomHex(16),
    traceId: readHttpHeader(headers, 'traceparent') || randomHex(32),
    spanId: readHttpHeader(headers, 'x-span-id') || randomHex(16),
    userId,
    isAuthenticated: userId.length > 0,
    canCreateSample: parseBoolean(readHttpHeader(headers, 'x-can-create-sample')),
  };
}

export function buildWebsocketRequestContext(headers?: IncomingHttpHeaders): RequestContext {
  if (!headers) {
    return anonymousRequestContext('ws');
  }

  const context = buildHttpRequestContext(headers);
  return {
    ...context,
    protocol: 'ws',
  };
}

export function buildGrpcRequestContext(metadata: unknown): RequestContext {
  if (!isGrpcMetadataLike(metadata)) {
    return anonymousRequestContext('grpc');
  }

  const userId = readGrpcHeader(metadata, 'x-user-id');

  return {
    protocol: 'grpc',
    requestId: readGrpcHeader(metadata, 'x-request-id') || randomHex(16),
    correlationId: readGrpcHeader(metadata, 'x-correlation-id') || randomHex(16),
    traceId: readGrpcHeader(metadata, 'traceparent') || randomHex(32),
    spanId: readGrpcHeader(metadata, 'x-span-id') || randomHex(16),
    userId,
    isAuthenticated: userId.length > 0,
    canCreateSample: parseBoolean(readGrpcHeader(metadata, 'x-can-create-sample')),
  };
}

export function anonymousRequestContext(protocol: TransportProtocol = 'unknown'): RequestContext {
  return {
    protocol,
    requestId: randomHex(16),
    correlationId: randomHex(16),
    traceId: randomHex(32),
    spanId: randomHex(16),
    userId: '',
    isAuthenticated: false,
    canCreateSample: false,
  };
}
