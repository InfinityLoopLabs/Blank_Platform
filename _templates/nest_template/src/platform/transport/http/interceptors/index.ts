import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, finalize } from 'rxjs'

import { ObservabilityService } from '../../../modules/observability/transport'
import { getExecutionRequestContext } from '../../common'

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  constructor(private readonly observabilityService: ObservabilityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const requestContext = getExecutionRequestContext(context)
    const startedAt = Date.now()

    return next.handle().pipe(
      finalize(() => {
        const latencyMs = Date.now() - startedAt
        this.observabilityService.emit('request_timing', {
          requestId: requestContext.requestId,
          traceId: requestContext.traceId,
          spanId: requestContext.spanId,
          latencyMs,
        })
      }),
    )
  }
}
