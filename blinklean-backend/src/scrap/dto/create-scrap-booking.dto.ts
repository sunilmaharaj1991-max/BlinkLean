import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ScrapItemDto {
    @IsString()
    @IsNotEmpty()
    material_name: string;

    @IsNumber()
    @Min(0.1)
    estimated_weight: number;
}

export class CreateScrapBookingDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    pincode: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScrapItemDto)
    items: ScrapItemDto[];
}
