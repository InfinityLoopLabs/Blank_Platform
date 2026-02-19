import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { RequestContext, getExecutionRequestContext } from '../../common';

type RpcPayloadWithContext = Record<string, unknown> & {
  requestContext?: RequestContext;
};

@Injectable()
export class GrpcContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<'http' | 'rpc' | string>() !== 'rpc') {
      return next.handle();
    }

    const requestContext = getExecutionRequestContext(context);
    const payload = context.switchToRpc().getData<unknown>();

    if (typeof payload === 'object' && payload !== null) {
      const payloadWithContext = payload as RpcPayloadWithContext;
      payloadWithContext.requestContext = requestContext;
    }

    return next.handle();
  }
}
