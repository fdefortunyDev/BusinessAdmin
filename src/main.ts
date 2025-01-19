import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API documentation: ${await app.getUrl()}/docs`);
}
bootstrap();
