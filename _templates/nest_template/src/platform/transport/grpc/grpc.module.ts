import { Module } from '@nestjs/common';

import { GrpcTransportService } from './grpc.service';

@Module({
  providers: [GrpcTransportService],
  exports: [GrpcTransportService],
})
export class GrpcTransportModule {}
