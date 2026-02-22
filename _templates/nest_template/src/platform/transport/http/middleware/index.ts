import { Injectable, NestMiddleware } from '@nestjs/common'

import { NextFunction, Request, Response } from 'express'

import { buildRequestContext, RequestWithContextType } from '../context'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    const requestWithContext = request as RequestWithContextType
    requestWithContext.requestContext = buildRequestContext(request.headers)
    next()
  }
}
