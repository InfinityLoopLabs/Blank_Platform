import { ArgumentsHost, ExecutionContext } from '@nestjs/common'

import { Request } from 'express'

import {
  RequestContextType,
  anonymousRequestContext,
  buildGrpcRequestContext,
  buildHttpRequestContext,
} from './context'

type RequestWithContextType = Request & {
  requestContext?: RequestContextType
}

type RpcContainerType = {
  metadata?: unknown
}

function hasMetadata(value: unknown): value is RpcContainerType {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return 'metadata' in value
}

function resolveRpcMetadata(rpcContext: unknown, rpcData: unknown): unknown {
  if (hasMetadata(rpcContext)) {
    return rpcContext.metadata
  }
  if (hasMetadata(rpcData)) {
    return rpcData.metadata
  }

  return rpcContext
}

export function getExecutionRequestContext(
  context: ExecutionContext,
): RequestContextType {
  const type = context.getType<'http' | 'rpc' | string>()

  if (type === 'http') {
    const request = context.switchToHttp().getRequest<RequestWithContextType>()
    if (request.requestContext) {
      return request.requestContext
    }

    return buildHttpRequestContext(request.headers)
  }

  if (type === 'rpc') {
    const rpc = context.switchToRpc()
    const metadata = resolveRpcMetadata(
      rpc.getContext<unknown>(),
      rpc.getData<unknown>(),
    )

    return buildGrpcRequestContext(metadata)
  }

  return anonymousRequestContext('unknown')
}

export function getHostRequestContext(host: ArgumentsHost): RequestContextType {
  const type = host.getType<'http' | 'rpc' | string>()

  if (type === 'http') {
    const request = host.switchToHttp().getRequest<RequestWithContextType>()
    if (request.requestContext) {
      return request.requestContext
    }

    return buildHttpRequestContext(request.headers)
  }

  if (type === 'rpc') {
    const rpc = host.switchToRpc()
    const metadata = resolveRpcMetadata(
      rpc.getContext<unknown>(),
      rpc.getData<unknown>(),
    )

    return buildGrpcRequestContext(metadata)
  }

  return anonymousRequestContext('unknown')
}
