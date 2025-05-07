import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main-ProductsMicroservice');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new PrismaExceptionFilter);

  await app.listen(envs.port);
  
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
