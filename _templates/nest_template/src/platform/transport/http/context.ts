import { IncomingHttpHeaders } from 'http'

import { Request } from 'express'

import { RequestContextType, buildHttpRequestContext } from '../common'
export type { RequestContextType } from '../common'

export type RequestWithContextType = Request & {
  requestContext?: RequestContextType
}

export function buildRequestContext(
  headers: IncomingHttpHeaders,
): RequestContextType {
  return buildHttpRequestContext(headers)
}

export function getRequestContext(
  request: RequestWithContextType,
): RequestContextType {
  if (request.requestContext) {
    return request.requestContext
  }

  return buildRequestContext(request.headers)
}
