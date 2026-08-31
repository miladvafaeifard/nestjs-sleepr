import { IsNumber, IsNotEmpty, IsString, IsEmail, IsIn } from "class-validator";
import type { PaymentCompletedEventDto } from "@app/common";

export class HandlePaymentCompletedDto implements PaymentCompletedEventDto {
    @IsString()
    @IsNotEmpty()
    readonly paymentIntentId!: string;

    @IsNumber()
    @IsNotEmpty()
    readonly amount!: number;

    @IsString()
    @IsIn(['usd', 'huf', 'eur'])
    readonly currency!: string;

    @IsString()
    @IsNotEmpty()
    readonly status!: string;

    @IsString()
    readonly text!: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;
}
