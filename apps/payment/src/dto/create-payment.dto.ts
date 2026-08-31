import { IsNumber, IsNotEmpty, IsEmail, IsIn } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    @IsNotEmpty()
    readonly amount!: number;
    
    @IsNotEmpty()
    @IsIn(["usd", "huf", "eur"])
    readonly currency!: string;
    
    @IsEmail()
    readonly email!: string;
}
