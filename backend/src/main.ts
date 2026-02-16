import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefijo global para API
  app.setGlobalPrefix('api');

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de excepciones HTTP
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // CORS para el frontend
  app.enableCors({
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 IttiAcademy Mentor API corriendo en puerto ${port}`);
  logger.log(`📡 WebSocket disponible en /chat`);
  logger.log(`🤖 Proveedor LLM: ${process.env.LLM_PROVIDER || 'openai'}`);
}

bootstrap();
