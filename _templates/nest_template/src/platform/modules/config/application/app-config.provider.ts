import { Injectable } from '@nestjs/common'

import { AppConfigType } from '../domain/app-config'
import { ConfigService } from './config.service'

/**
 * Typed application config provider.
 * Resolves validated runtime config once and exposes it for DI by class token.
 */
@Injectable()
export class AppConfigProvider {
  readonly value: AppConfigType

  constructor(private readonly configService: ConfigService) {
    this.value = this.configService.load()
  }
}
