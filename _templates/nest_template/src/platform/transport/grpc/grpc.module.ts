import { Module } from '@nestjs/common';

import { GrpcContextInterceptor } from './interceptors';
import { GrpcTransportService } from './grpc.service';

@Module({
  providers: [GrpcTransportService, GrpcContextInterceptor],
  exports: [GrpcTransportService, GrpcContextInterceptor],
})
export class GrpcTransportModule {}
