import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'

import { EnvConfigRepository } from '../adapters/env-config.repository'
import { AppConfigProvider } from '../application/app-config.provider'
import { ConfigService } from '../application/config.service'
import { CONFIG_REPOSITORY } from '../ports/config.repository'
import {
  resolveRuntimeEnv,
  validateEnvironment,
} from './environment.validation'

const runtimeEnv = resolveRuntimeEnv(
  process.env as Record<string, string | undefined>,
)
const environmentModule = NestConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env.${runtimeEnv}`, '.env'],
  expandVariables: true,
  validate: (env: Record<string, unknown>) =>
    validateEnvironment(env as Record<string, string | undefined>),
})

@Module({
  imports: [environmentModule],
  providers: [
    {
      provide: EnvConfigRepository,
      useFactory: () =>
        new EnvConfigRepository(
          Object.freeze({ ...process.env }) as Record<
            string,
            string | undefined
          >,
        ),
    },
    {
      provide: CONFIG_REPOSITORY,
      useExisting: EnvConfigRepository,
    },
    ConfigService,
    AppConfigProvider,
  ],
  exports: [
    AppConfigProvider,
    CONFIG_REPOSITORY,
    EnvConfigRepository,
    ConfigService,
  ],
})
export class ConfigModule {}
