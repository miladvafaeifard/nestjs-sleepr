import { Injectable, Logger } from '@nestjs/common';
import type { PaymentCompletedEventDto } from '@app/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  notifyPaymentCompleted(payment: PaymentCompletedEventDto): void {
    this.logger.log(
      `Payment ${payment.paymentIntentId} completed: ${payment.amount} ${payment.currency} (${payment.status})`,
    );
  }
}
