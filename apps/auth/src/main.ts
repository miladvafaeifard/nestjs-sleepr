import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);
    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: process.env.AUTH_SERVICE_PORT!,
        },
    });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const logger = app.get(Logger);
    app.useLogger(logger);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');
    await app.listen(port);
    logger.log(`http listening port ${port}`);
}
bootstrap();
