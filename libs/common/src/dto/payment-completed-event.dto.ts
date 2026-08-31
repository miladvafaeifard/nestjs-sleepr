export interface PaymentCompletedEventDto {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  text?: string;
  email: string;
}
