import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common'

import { Response } from 'express'

import { getRequestContext } from '../context'
import { MiddlewareError } from '../guards'
import { ResponseFactory } from '../response.factory'

export function mapError(error: unknown): {
  statusCode: number
  code: string
  message: string
} {
  if (error instanceof MiddlewareError) {
    if (error.code === 'VALIDATION_ERROR') {
      return {
        statusCode: 400,
        code: error.code,
        message: error.message,
      }
    }
    if (error.code === 'UNAUTHENTICATED') {
      return {
        statusCode: 401,
        code: error.code,
        message: error.message,
      }
    }
    if (error.code === 'FORBIDDEN') {
      return {
        statusCode: 403,
        code: error.code,
        message: error.message,
      }
    }
    if (
      error.code === 'SCHEMA_INCOMPATIBLE' ||
      error.code === 'DEPENDENCY_UNAVAILABLE'
    ) {
      return {
        statusCode: 503,
        code: error.code,
        message: error.message,
      }
    }
  }

  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'internal server error',
  }
}

@Injectable()
@Catch()
export class MiddlewareExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseFactory: ResponseFactory) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()
    const request = http.getRequest()

    const mapped = mapError(exception)
    const context = getRequestContext(request)
    const result = this.responseFactory.error(
      mapped.statusCode,
      mapped.message,
      mapped.code,
      context
    )

    response.status(result.statusCode).json(result.envelope)
  }
}
