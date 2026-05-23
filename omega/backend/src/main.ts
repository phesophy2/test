import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 5001;
  await app.listen(port);
  logger.log(`Nest application successfully started on port ${port}`);
}
bootstrap();
