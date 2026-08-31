import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(new ValidationPipe())
  @MessagePattern('createPayment')
  async createPayment(@Payload() data: CreatePaymentDto) {
    return await this.paymentService.createPayment(data);
  }
}
