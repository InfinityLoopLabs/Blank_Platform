import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

type RpcContainer = {
  metadata?: unknown;
};

type GrpcMetadataLike = {
  get?: (key: string) => unknown[];
  getMap?: () => Record<string, unknown>;
};

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const rpc = context.switchToRpc();
    const rpcContext = rpc.getContext<unknown>();
    const rpcData = rpc.getData<unknown>();
    const metadata = this.resolveMetadata(rpcContext, rpcData);
    const userId = this.extractUserIdFromGrpcMetadata(metadata);

    if (userId.length === 0) {
      throw new UnauthorizedException('authentication failed');
    }

    return true;
  }

  private resolveMetadata(rpcContext: unknown, rpcData: unknown): unknown {
    if (this.hasMetadata(rpcContext)) {
      return rpcContext.metadata;
    }
    if (this.hasMetadata(rpcData)) {
      return rpcData.metadata;
    }
    return rpcContext;
  }

  private hasMetadata(value: unknown): value is RpcContainer {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    return 'metadata' in value;
  }

  private extractUserIdFromGrpcMetadata(metadata: unknown): string {
    if (!this.isGrpcMetadataLike(metadata)) {
      return '';
    }

    const fromGetter = this.readFromGrpcGet(metadata, 'x-user-id');
    if (fromGetter.length > 0) {
      return fromGetter;
    }

    const fromMap = this.readFromGrpcMap(metadata, 'x-user-id');
    if (fromMap.length > 0) {
      return fromMap;
    }

    return '';
  }

  private isGrpcMetadataLike(value: unknown): value is GrpcMetadataLike {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    return 'get' in value || 'getMap' in value;
  }

  private readFromGrpcGet(metadata: GrpcMetadataLike, key: string): string {
    if (!metadata.get) {
      return '';
    }
    const values = metadata.get(key);
    if (values.length === 0) {
      return '';
    }
    return this.normalize(values[0]);
  }

  private readFromGrpcMap(metadata: GrpcMetadataLike, key: string): string {
    if (!metadata.getMap) {
      return '';
    }
    const map = metadata.getMap();
    return this.normalize(map[key]);
  }

  private normalize(value: unknown): string {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Buffer.isBuffer(value)) {
      return value.toString('utf8').trim();
    }
    return '';
  }
}
