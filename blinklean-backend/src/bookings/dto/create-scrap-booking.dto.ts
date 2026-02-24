import { IsString, IsNotEmpty, IsDateString, Matches, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ScrapItemDto {
  @IsString()
  @IsNotEmpty()
  material_name: string;

  @IsNumber()
  estimated_weight: number;
}

export class CreateScrapBookingDto {
  @IsString()
  @IsNotEmpty()
  pickup_address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[1-9][0-9]{5}$/, { message: 'Invalid pincode format' })
  pincode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScrapItemDto)
  selected_materials: ScrapItemDto[];

  @IsNumber()
  @IsOptional()
  estimated_weight?: number;

  @IsNumber()
  @IsOptional()
  predicted_price?: number;

  @IsDateString()
  @IsNotEmpty()
  pickup_date: string;
}
