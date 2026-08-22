import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/database/database.module';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationSchema, ReservationDocument } from './entities/reservation.schema';

@Module({
  controllers: [ReservationsController],
  imports: [
    DatabaseModule,    
    DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }])
  ],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
