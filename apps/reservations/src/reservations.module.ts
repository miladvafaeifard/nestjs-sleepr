import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
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
      }),
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
    ClientsModule.register([
      { name: AUTH_SERVICE, transport: Transport.TCP }
    ]),
  ],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
