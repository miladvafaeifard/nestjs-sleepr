import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { AUTH_SERVICE, DatabaseModule, LoggerModule, PAYMENT_SERVICE } from '@app/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationSchema, ReservationDocument } from './entities/reservation.schema';

@Module({
  controllers: [ReservationsController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_SERVICE_HOST: Joi.string().required(),
        AUTH_SERVICE_PORT: Joi.number().required(),
        PAYMENT_SERVICE_HOST: Joi.string().required(),
        PAYMENT_SERVICE_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => (
          {
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE_HOST'),
            port: configService.get<number>('AUTH_SERVICE_PORT'),
          }
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENT_SERVICE,
        useFactory: (configService: ConfigService) => (
          {
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PAYMENT_SERVICE_HOST'),
            port: configService.get<number>('PAYMENT_SERVICE_PORT'),
          }
        }),
        inject: [ConfigService],
      },
      
    ]),
  ],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
