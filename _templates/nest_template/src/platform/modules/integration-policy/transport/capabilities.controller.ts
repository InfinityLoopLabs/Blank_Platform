import { Controller, Get, HttpCode, HttpStatus, Inject, Req } from '@nestjs/common';

import { RequestWithContext, getRequestContext } from '../../../transport/http/context';
import { ResponseFactory } from '../../../transport/http/response.factory';
import { IntegrationPolicyService } from '../application/integration-policy.service';
import { IntegrationPolicies } from '../domain/integration-policy';
import { INTEGRATION_POLICIES_TOKEN } from './tokens';

@Controller('internal/capabilities')
export class CapabilitiesController {
  constructor(
    @Inject(INTEGRATION_POLICIES_TOKEN) private readonly config: IntegrationPolicies,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  status(@Req() request: RequestWithContext) {
    const context = getRequestContext(request);
    return this.responseFactory.ok(
      'integration capabilities',
      IntegrationPolicyService.capabilityReport(this.config),
      context,
    ).envelope;
  }
}
