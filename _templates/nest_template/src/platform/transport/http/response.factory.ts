import { Injectable } from '@nestjs/common';

import { RequestContext } from './context';

type ErrorPayload = {
  code: string;
};

type Envelope<TPayload> = {
  message: string;
  payload: TPayload | null;
  meta: {
    timestamp: string;
    requestId?: string;
    correlationId?: string;
    traceId?: string;
    spanId?: string;
  };
  error: ErrorPayload | null;
};

@Injectable()
export class ResponseFactory {
  ok<TPayload>(message: string, payload: TPayload, context: RequestContext): { statusCode: number; envelope: Envelope<TPayload> } {
    return {
      statusCode: 200,
      envelope: {
        message,
        payload,
        meta: this.meta(context),
        error: null,
      },
    };
  }

  created<TPayload>(message: string, payload: TPayload, context: RequestContext): { statusCode: number; envelope: Envelope<TPayload> } {
    return {
      statusCode: 201,
      envelope: {
        message,
        payload,
        meta: this.meta(context),
        error: null,
      },
    };
  }

  error(statusCode: number, message: string, code: string, context: RequestContext): { statusCode: number; envelope: Envelope<never> } {
    return {
      statusCode,
      envelope: {
        message,
        payload: null,
        meta: this.meta(context),
        error: { code },
      },
    };
  }

  private meta(context: RequestContext) {
    return {
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      correlationId: context.correlationId,
      traceId: context.traceId,
      spanId: context.spanId,
    };
  }
}
