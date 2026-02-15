import { Controller, Get, HttpCode, HttpStatus, Req, Res, UseFilters } from '@nestjs/common';

import { Response } from 'express';

import { RequestWithContext, getRequestContext } from '../../../transport/http/context';
import { MiddlewareExceptionFilter } from '../../../transport/http/filters';
import { ResponseFactory } from '../../../transport/http/response.factory';
import { HealthService } from '../application/health.service';

@Controller()
@UseFilters(MiddlewareExceptionFilter)
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Get('health/liveness')
  @HttpCode(HttpStatus.OK)
  liveness(@Req() request: RequestWithContext) {
    const context = getRequestContext(request);
    return this.responseFactory.ok('liveness up', { status: 'up' }, context).envelope;
  }

  @Get('health/readiness')
  readiness(
    @Req() request: RequestWithContext,
    @Res({ passthrough: true }) response: Response,
  ) {
    const context = getRequestContext(request);
    const status = this.healthService.status();
    const output = status.isReadinessUp
      ? this.responseFactory.ok('readiness up', status, context)
      : this.responseFactory.error(HttpStatus.SERVICE_UNAVAILABLE, 'readiness down', status.reasonCode, context);

    response.status(output.statusCode);
    return output.envelope;
  }

  @Get('internal/health/status')
  @HttpCode(HttpStatus.OK)
  healthStatus(@Req() request: RequestWithContext) {
    const context = getRequestContext(request);
    return this.responseFactory.ok('health status', this.healthService.status(), context).envelope;
  }
}
