import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { switchMap, tap } from 'rxjs';

import { PAYMENT_SERVICE, type UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy
  ) {}

  async create(createReservationDto: CreateReservationDto, user: UserDto) {
    return this.paymentService
      .send('createPayment', {
        amount: 1000,
        currency: 'huf',
        email: user.email,
      })
      .pipe(
        tap((paymentIntent) => {
          if (!paymentIntent) {
            throw new Error('Payment failed');
          }

          console.log('Payment successful:', paymentIntent);  
        }),
        switchMap(() =>
          this.reservationsRepository.create({ ...createReservationDto, userId: user._id, timestamp: new Date() }),
        ),
    );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id: _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({ _id }, {$set: updateReservationDto});
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
