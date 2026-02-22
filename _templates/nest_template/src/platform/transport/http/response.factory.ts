import { Injectable } from '@nestjs/common'

import { RequestContextType } from './context'

type ErrorPayloadType = {
  code: string
}

type EnvelopeType<TPayload> = {
  message: string
  payload: TPayload | null
  meta: {
    timestamp: string
    requestId?: string
    correlationId?: string
    traceId?: string
    spanId?: string
  }
  error: ErrorPayloadType | null
}

@Injectable()
export class ResponseFactory {
  ok<TPayload>(
    message: string,
    payload: TPayload,
    context: RequestContextType,
  ): { statusCode: number; envelope: EnvelopeType<TPayload> } {
    return {
      statusCode: 200,
      envelope: {
        message,
        payload,
        meta: this.meta(context),
        error: null,
      },
    }
  }

  created<TPayload>(
    message: string,
    payload: TPayload,
    context: RequestContextType,
  ): { statusCode: number; envelope: EnvelopeType<TPayload> } {
    return {
      statusCode: 201,
      envelope: {
        message,
        payload,
        meta: this.meta(context),
        error: null,
      },
    }
  }

  error(
    statusCode: number,
    message: string,
    code: string,
    context: RequestContextType,
  ): { statusCode: number; envelope: EnvelopeType<never> } {
    return {
      statusCode,
      envelope: {
        message,
        payload: null,
        meta: this.meta(context),
        error: { code },
      },
    }
  }

  private meta(context: RequestContextType) {
    return {
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      correlationId: context.correlationId,
      traceId: context.traceId,
      spanId: context.spanId,
    }
  }
}
