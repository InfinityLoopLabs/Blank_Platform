import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { APP_CONFIG_TOKEN, AppConfig } from './platform/modules/config/transport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfig>(APP_CONFIG_TOKEN);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sample API')
    .setVersion('v1')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'openapi.json',
  });

  await app.listen(config.appPort);

  // eslint-disable-next-line no-console
  console.log(`nest template ready env=${config.appEnv} port=${config.appPort}`);
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
