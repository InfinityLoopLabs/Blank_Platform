import { IncomingHttpHeaders } from 'http';

import { Request } from 'express';

export type RequestContext = {
  requestId: string;
  correlationId: string;
  traceId: string;
  spanId: string;
  isAuthenticated: boolean;
  canCreateSample: boolean;
};

export type RequestWithContext = Request & {
  requestContext?: RequestContext;
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

function headerValue(headers: IncomingHttpHeaders, key: string): string | undefined {
  const raw = headers[key];
  if (Array.isArray(raw)) {
    return raw[0];
  }
  return raw;
}

export function buildRequestContext(headers: IncomingHttpHeaders): RequestContext {
  const userId = (headerValue(headers, 'x-user-id') ?? '').trim();

  return {
    requestId: headerValue(headers, 'x-request-id') ?? randomHex(16),
    correlationId: headerValue(headers, 'x-correlation-id') ?? randomHex(16),
    traceId: headerValue(headers, 'traceparent') ?? randomHex(32),
    spanId: headerValue(headers, 'x-span-id') ?? randomHex(16),
    isAuthenticated: userId.length > 0,
    canCreateSample: (headerValue(headers, 'x-can-create-sample') ?? '').toLowerCase() === 'true',
  };
}

export function getRequestContext(request: RequestWithContext): RequestContext {
  if (request.requestContext) {
    return request.requestContext;
  }
  return buildRequestContext(request.headers);
}
