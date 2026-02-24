import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  otp: string;
}
