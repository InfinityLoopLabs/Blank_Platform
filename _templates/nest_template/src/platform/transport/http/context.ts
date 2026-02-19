import { IncomingHttpHeaders } from 'http';

import { Request } from 'express';

import { RequestContext, buildHttpRequestContext } from '../common';
export type { RequestContext } from '../common';

export type RequestWithContext = Request & {
  requestContext?: RequestContext;
};

export function buildRequestContext(headers: IncomingHttpHeaders): RequestContext {
  return buildHttpRequestContext(headers);
}

export function getRequestContext(request: RequestWithContext): RequestContext {
  if (request.requestContext) {
    return request.requestContext;
  }
  return buildRequestContext(request.headers);
}
