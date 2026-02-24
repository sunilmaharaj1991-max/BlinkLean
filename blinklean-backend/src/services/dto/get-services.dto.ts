import { IsOptional, IsString, Matches } from 'class-validator';

export class GetServicesDto {
  @IsOptional()
  @IsString()
  @Matches(/^[1-9][0-9]{5}$/, { message: 'Invalid pincode format' })
  pincode?: string;
}
