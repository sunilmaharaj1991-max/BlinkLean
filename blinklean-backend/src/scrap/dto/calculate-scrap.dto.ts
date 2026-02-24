import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ScrapItemDto {
    @IsString()
    material_name: string;

    @IsNumber()
    estimated_weight: number; // in KG
}

export class CalculateScrapDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScrapItemDto)
    items: ScrapItemDto[];
}
