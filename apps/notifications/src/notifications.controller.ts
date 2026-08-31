import { Controller, ValidationPipe, UsePipes } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  PAYMENT_COMPLETED_EVENT
} from '@app/common';
import { NotificationsService } from './notifications.service';
import { HandlePaymentCompletedDto } from './dto/handle-payment-completed.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern(PAYMENT_COMPLETED_EVENT)
  handlePaymentCompleted(@Payload() payment: HandlePaymentCompletedDto): void {
    this.notificationsService.notifyPaymentCompleted(payment);
  }
}
