import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../admin/guards/roles.decorator';
import { AdminRole } from '../admin/admin.entity';
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

    // Admin Controls
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
    @Put('rates/:id')
    updateScrapRate(@Param('id') id: string, @Body('rate_per_kg') rate_per_kg: number) {
        return this.scrapService.updateRate(+id, rate_per_kg);
    }
}
