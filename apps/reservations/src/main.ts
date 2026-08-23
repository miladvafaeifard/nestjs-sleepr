import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { Logger } from 'pino-nestjs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  const logger = app.get(Logger);
  app.useLogger(logger);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  logger.log(`https listening port ${port}`);
}
bootstrap();
