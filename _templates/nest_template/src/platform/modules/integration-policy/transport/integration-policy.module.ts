import { Module } from '@nestjs/common';

import { ConfigModule } from '../../config/transport';
import { ResponseFactory } from '../../../transport/http/response.factory';
import { IntegrationPolicyService } from '../application/integration-policy.service';
import { CapabilitiesController } from './capabilities.controller';
import { INTEGRATION_POLICIES_TOKEN } from './tokens';

@Module({
  imports: [ConfigModule],
  controllers: [CapabilitiesController],
  providers: [
    ResponseFactory,
    IntegrationPolicyService,
    {
      provide: INTEGRATION_POLICIES_TOKEN,
      inject: [IntegrationPolicyService],
      useFactory: (integrationPolicyService: IntegrationPolicyService) => integrationPolicyService.load(),
    },
  ],
  exports: [INTEGRATION_POLICIES_TOKEN, IntegrationPolicyService],
})
export class IntegrationPolicyModule {}
