import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  PAYMENT_COMPLETED_EVENT,
  type PaymentCompletedEventDto,
} from '@app/common';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getHello(): string {
    return this.notificationsService.getHello();
  }

  @EventPattern(PAYMENT_COMPLETED_EVENT)
  handlePaymentCompleted(@Payload() payment: PaymentCompletedEventDto): void {
    this.notificationsService.notifyPaymentCompleted(payment);
  }
}
