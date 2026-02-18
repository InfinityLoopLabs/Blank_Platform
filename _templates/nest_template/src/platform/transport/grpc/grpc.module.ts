import { Module } from '@nestjs/common';

import { GrpcAuthGuard } from './grpc-auth.guard';
import { GrpcTransportService } from './grpc.service';

@Module({
  providers: [GrpcTransportService, GrpcAuthGuard],
  exports: [GrpcTransportService, GrpcAuthGuard],
})
export class GrpcTransportModule {}
