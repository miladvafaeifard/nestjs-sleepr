import { Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, take } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
  NOTIFICATIONS_SERVICE,
  PAYMENT_COMPLETED_EVENT,
  type PaymentCompletedEventDto,
} from '@app/common';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: createPaymentDto.amount * 100,
      currency: createPaymentDto.currency,
      confirm: true,
      payment_method: 'pm_card_visa',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    const event: PaymentCompletedEventDto = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      email: createPaymentDto.email,
      text: `Payment of ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()} completed successfully.`,
    };

    this.notificationsClient
      .emit(PAYMENT_COMPLETED_EVENT, event)
      .subscribe({
        error: (error: unknown) => {
          this.logger.error('Failed to emit payment completed event', error);
        },
      });

    return paymentIntent;
  }
}
