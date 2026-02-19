import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  TransportError,
  getExecutionRequestContext,
} from '../../common';

export class MiddlewareError extends TransportError {}

export const REQUIRED_POLICY_METADATA_KEY = 'requiredPolicy';
export const RequiredPolicy = (policy: string) => SetMetadata(REQUIRED_POLICY_METADATA_KEY, policy);

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requestContext = getExecutionRequestContext(context);

    if (!requestContext.isAuthenticated) {
      throw new MiddlewareError('UNAUTHENTICATED', 'authentication failed');
    }

    return true;
  }
}

export const HttpAuthGuard = AuthGuard;

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPolicy = this.reflector.getAllAndOverride<string>(REQUIRED_POLICY_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPolicy) {
      return true;
    }

    const requestContext = getExecutionRequestContext(context);

    if (requiredPolicy === 'sample:create' && !requestContext.canCreateSample) {
      throw new MiddlewareError('FORBIDDEN', 'policy denied');
    }

    return true;
  }
}
