import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
  @IsPhoneNumber()
  phone_number: string;
}
