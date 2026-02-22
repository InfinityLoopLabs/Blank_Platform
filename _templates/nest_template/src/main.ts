import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AppConfigProvider } from './platform/modules/config/transport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  app.enableShutdownHooks()
  const config = app.get(AppConfigProvider).value
  const appEnv = (process.env.APP_ENV ?? process.env.NODE_ENV ?? config.appEnv)
    .trim()
    .toLowerCase()
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0)

  app.enableCors({
    origin:
      corsOrigins.length > 0
        ? corsOrigins
        : appEnv === 'production'
          ? false
          : true,
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  const swaggerFlag = (process.env.SWAGGER_ENABLED ?? '').trim().toLowerCase()
  const isSwaggerEnabled = swaggerFlag
    ? swaggerFlag === 'true'
    : appEnv !== 'production'
  if (isSwaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sample API')
      .setVersion('v1')
      .build()
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, swaggerDocument, {
      jsonDocumentUrl: 'openapi.json',
    })
  }

  await app.listen(config.appPort)

  logger.log(`nest template ready env=${config.appEnv} port=${config.appPort}`)
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap')
  logger.error(error)
  process.exit(1)
})
