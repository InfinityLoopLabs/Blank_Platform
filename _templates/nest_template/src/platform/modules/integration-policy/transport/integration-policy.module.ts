import { Module } from '@nestjs/common'

import { ResponseFactory } from '../../../transport/http/response.factory'
import { ConfigModule } from '../../config/transport'
import { IntegrationPolicyService } from '../application/integration-policy.service'
import { CapabilitiesController } from './capabilities.controller'

@Module({
  imports: [ConfigModule],
  controllers: [CapabilitiesController],
  providers: [ResponseFactory, IntegrationPolicyService],
  exports: [IntegrationPolicyService],
})
export class IntegrationPolicyModule {}
