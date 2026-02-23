import { MinioConnectorModule } from '@infinityloop.labs/nest-connectors'
import { Module } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'
import {
  ConfigModule,
  EnvConfigRepository,
  optionalString,
  requiredBoolean,
  requiredPositiveInt,
  requiredString,
} from '@core/modules/config/transport'
import { createUseFactoryFromEnvConfig } from '@core/utils'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      MinioConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [EnvConfigRepository],
        useFactory: createUseFactoryFromEnvConfig(
          (env: EnvConfigRepository) => ({
            endPoint: requiredString(env, 'MINIO_ENDPOINT'),
            port: requiredPositiveInt(env, 'MINIO_PORT'),
            useSSL: requiredBoolean(env, 'MINIO_USE_SSL'),
            accessKey: requiredString(env, 'MINIO_ACCESS_KEY'),
            secretKey: requiredString(env, 'MINIO_SECRET_KEY'),
            region: optionalString(env, 'MINIO_REGION'),
          }),
        ),
      }),
      'MINIO_ENABLED',
    ),
  ],
})
export class MinioModule {}
