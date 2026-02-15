import { Injectable } from '@nestjs/common';

@Injectable()
export class GrpcTransportService {
  readonly isEnabled = false;

  descriptor() {
    return {
      protocol: 'grpc',
      status: this.isEnabled ? 'enabled' : 'sample',
      message: 'gRPC transport scaffold is ready for implementation',
    };
  }
}
