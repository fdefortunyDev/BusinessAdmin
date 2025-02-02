import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:8080/', // Reemplázalo por la url del frontend correcto
    credentials: true, // Habilita el envío de cookies
  });

  const configService = new ConfigService();

  app.use(cookieParser()); // Necesario para sesiones

  const config = new DocumentBuilder()
    .setTitle('Business Admin')
    .setDescription('API for Business Administration')
    .setVersion('0.0.1')
    .setContact(
      'Federico de Fortuny',
      'https://www.linkedin.com/in/fdefortuny/',
      'fdefortuny@gmail.com',
    )
    .addApiKey({ type: 'apiKey', in: 'header', name: 'apikey' }, 'apikey')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(configService.get('APP_PORT') || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
