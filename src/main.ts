import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main-ProductsMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new PrismaExceptionFilter);

  await app.listen();
  
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
