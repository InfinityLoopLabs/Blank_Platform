import { Module } from '@nestjs/common'

import { GrpcTransportService } from './grpc.service'
import { GrpcContextInterceptor } from './interceptors'

@Module({
  providers: [GrpcTransportService, GrpcContextInterceptor],
  exports: [GrpcTransportService, GrpcContextInterceptor],
})
export class GrpcTransportModule {}
