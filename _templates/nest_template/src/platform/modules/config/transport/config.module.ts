import { Module } from '@nestjs/common';

import { AppConfigProvider } from '../application/app-config.provider';
import { ConfigService } from '../application/config.service';
import { EnvConfigRepository } from '../adapters/env-config.repository';

@Module({
  providers: [
    {
      provide: EnvConfigRepository,
      useFactory: () => new EnvConfigRepository(process.env),
    },
    ConfigService,
    {
      provide: AppConfigProvider,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => new AppConfigProvider(configService.load()),
    },
  ],
  exports: [AppConfigProvider, EnvConfigRepository, ConfigService],
})
export class ConfigModule {}
