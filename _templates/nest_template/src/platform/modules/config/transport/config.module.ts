import { Module } from '@nestjs/common';

import { ConfigService } from '../application/config.service';
import { EnvConfigRepository } from '../adapters/env-config.repository';
import { APP_CONFIG_TOKEN, CONFIG_REPOSITORY_TOKEN } from './tokens';

@Module({
  providers: [
    {
      provide: CONFIG_REPOSITORY_TOKEN,
      useFactory: () => new EnvConfigRepository(process.env),
    },
    ConfigService,
    {
      provide: APP_CONFIG_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.load(),
    },
  ],
  exports: [APP_CONFIG_TOKEN, CONFIG_REPOSITORY_TOKEN, ConfigService],
})
export class ConfigModule {}
