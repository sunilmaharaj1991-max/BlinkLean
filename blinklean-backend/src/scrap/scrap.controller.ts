import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScrapService } from './scrap.service';
import { CalculateScrapDto } from './dto/calculate-scrap.dto';

@Controller('scrap')
export class ScrapController {
    constructor(private readonly scrapService: ScrapService) { }

    // Get active scrap rates for users and AI logic
    @Get('rates')
    getRates() {
        return this.scrapService.getAllRates();
    }

    // Calculate scrap estimation
    @UseGuards(AuthGuard('jwt'))
    @Post('estimate')
    calculateEstimate(@Body() dto: CalculateScrapDto) {
        return this.scrapService.calculateEstimatedValue(dto);
    }


}
