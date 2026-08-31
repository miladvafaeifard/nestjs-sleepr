import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    console.log('Creating payment with amount:', createPaymentDto.amount, 'and currency:', createPaymentDto.currency);
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
    return paymentIntent;
  }
}
