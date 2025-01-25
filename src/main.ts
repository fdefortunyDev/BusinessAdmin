import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Gym Admin')
    .setDescription('API for Gym Administration')
    .setVersion('0.0.1')
    .setContact(
      'Federico de Fortuny',
      'https://www.linkedin.com/in/fdefortuny/',
      'fdefortuny@gmail.com',
    )
    .addApiKey({ type: 'apiKey', in: 'header', name: 'apikey' }, 'apikey')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const configService = new ConfigService();
  await app.listen(configService.get('APP_PORT') || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
