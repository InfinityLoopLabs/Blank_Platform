import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common'

import { Response } from 'express'

import {
  getHostRequestContext,
  mapTransportError,
} from '../../common'
import { MiddlewareError } from '../guards'
import { ResponseFactory } from '../response.factory'
export const mapError = mapTransportError;

@Injectable()
@Catch()
export class MiddlewareExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseFactory: ResponseFactory) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const mapped = mapError(exception)
    const context = getHostRequestContext(host)

    if (host.getType<'http' | 'rpc' | string>() !== 'http') {
      throw new MiddlewareError(mapped.code, mapped.message)
    }

    const response = host.switchToHttp().getResponse<Response>()
    const result = this.responseFactory.error(
      mapped.statusCode,
      mapped.message,
      mapped.code,
      context
    )

    response.status(result.statusCode).json(result.envelope)
  }
}
