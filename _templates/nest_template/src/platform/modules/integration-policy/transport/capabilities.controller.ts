import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';

import { RequestWithContext, getRequestContext } from '../../../transport/http/context';
import { ResponseFactory } from '../../../transport/http/response.factory';
import { IntegrationPolicyService } from '../application/integration-policy.service';

@Controller('internal/capabilities')
export class CapabilitiesController {
  constructor(
    private readonly integrationPolicyService: IntegrationPolicyService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  status(@Req() request: RequestWithContext) {
    const context = getRequestContext(request);
    const config = this.integrationPolicyService.load();
    return this.responseFactory.ok(
      'integration capabilities',
      IntegrationPolicyService.capabilityReport(config),
      context,
    ).envelope;
  }
}
