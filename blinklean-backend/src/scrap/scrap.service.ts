import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapRate } from './scrap-rate.entity';
import { ScrapBooking } from './scrap-booking.entity';
import { CalculateScrapDto, ScrapItemDto } from './dto/calculate-scrap.dto';
import { CreateScrapBookingDto } from './dto/create-scrap-booking.dto';

@Injectable()
export class ScrapService {
    constructor(
        @InjectRepository(ScrapRate)
        private scrapRateRepository: Repository<ScrapRate>,
        @InjectRepository(ScrapBooking)
        private scrapBookingRepository: Repository<ScrapBooking>,
    ) { }

    // Helper method to simulate AI prediction or fetch from market logic
    // In a robust scenario, this calls `blinklean-ai` microservice. 
    // Here we use internal DB rates for immediate calculation.
    async onModuleInit() {
        // Seed default rates if empty for demonstration
        const count = await this.scrapRateRepository.count();
        if (count === 0) {
            await this.scrapRateRepository.save([
                { material_name: 'newspapers', rate_per_kg: 15.0 },
                { material_name: 'cardboard', rate_per_kg: 10.0 },
                { material_name: 'plastic', rate_per_kg: 12.0 },
                { material_name: 'metal', rate_per_kg: 30.0 },
                { material_name: 'aluminum', rate_per_kg: 110.0 },
                { material_name: 'copper', rate_per_kg: 400.0 },
                { material_name: 'e-waste', rate_per_kg: 25.0 },
                { material_name: 'glass bottles', rate_per_kg: 2.0 },
                { material_name: 'mixed scrap', rate_per_kg: 8.0 },
            ]);
        }
    }

    async getAllRates() {
        return this.scrapRateRepository.find({ where: { is_active: true } });
    }

    async updateRate(id: number, rate_per_kg: number) {
        await this.scrapRateRepository.update(id, { rate_per_kg });
        return this.scrapRateRepository.findOne({ where: { id } });
    }

    async calculateEstimatedValue(dto: CalculateScrapDto) {
        let totalEstimatedValue = 0;
        const itemsDetails: Array<{ material: string; estimated_weight: number; rate_per_kg: number; item_estimated_value: number }> = [];

        for (const item of dto.items) {
            const rate = await this.scrapRateRepository.findOne({
                where: { material_name: item.material_name, is_active: true },
            });

            if (!rate) {
                throw new NotFoundException(`Material rate for ${item.material_name} not found`);
            }

            const itemEstimatedValue = rate.rate_per_kg * item.estimated_weight;
            totalEstimatedValue += itemEstimatedValue;
            itemsDetails.push({
                material: item.material_name,
                estimated_weight: item.estimated_weight,
                rate_per_kg: rate.rate_per_kg,
                item_estimated_value: parseFloat(itemEstimatedValue.toFixed(2)),
            });
        }

        return {
            total_estimated_value: parseFloat(totalEstimatedValue.toFixed(2)),
            currency: 'INR',
            items: itemsDetails,
            message: 'Estimated value is based on current market rates. Final value will be confirmed at pickup.',
        };
    }
    async createBooking(dto: CreateScrapBookingDto) {
        const booking = this.scrapBookingRepository.create(dto);
        return this.scrapBookingRepository.save(booking);
    }

    async getBookingById(id: number) {
        return this.scrapBookingRepository.findOne({ where: { id } });
    }
}
