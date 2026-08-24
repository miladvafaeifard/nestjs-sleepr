import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/database/database.module';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationSchema, ReservationDocument } from './entities/reservation.schema';
import { LoggerModule } from '@app/common';

@Module({
  controllers: [ReservationsController],
  imports: [
    LoggerModule,
    DatabaseModule,    
    DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
  ],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
