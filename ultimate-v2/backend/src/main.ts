import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'https://*.khmerghost.com'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useWebSocketAdapter(new IoAdapter(app));
  
  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`✅ KhmerGhost Ultimate V2 running on http://localhost:${port}`);
  console.log(`📚 GraphQL playground: http://localhost:${port}/graphql`);
}
bootstrap();
