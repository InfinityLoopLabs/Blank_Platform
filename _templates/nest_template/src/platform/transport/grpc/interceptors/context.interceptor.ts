import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { Observable } from 'rxjs'

import { RequestContextType, getExecutionRequestContext } from '../../common'

type RpcPayloadWithContextType = Record<string, unknown> & {
  requestContext?: RequestContextType
}

@Injectable()
export class GrpcContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<'http' | 'rpc' | string>() !== 'rpc') {
      return next.handle()
    }

    const requestContext = getExecutionRequestContext(context)
    const payload = context.switchToRpc().getData<unknown>()

    if (typeof payload === 'object' && payload !== null) {
      const payloadWithContext = payload as RpcPayloadWithContextType
      payloadWithContext.requestContext = requestContext
    }

    return next.handle()
  }
}
