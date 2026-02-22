import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { AppConfigProvider } from '../application/app-config.provider';
import { ConfigService } from '../application/config.service';
import { EnvConfigRepository } from '../adapters/env-config.repository';
import { validateEnvironment } from './environment.validation';

const runtimeEnv = (process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development').trim() || 'development';
const environmentModule = NestConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env.${runtimeEnv}`, '.env'],
  expandVariables: true,
  validate: (env: Record<string, unknown>) => validateEnvironment(env as Record<string, string | undefined>),
});

@Module({
  imports: [environmentModule],
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
