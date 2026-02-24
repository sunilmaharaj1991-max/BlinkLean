import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AvailabilityService } from './availability.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Allow 10 max requests per 60 secs
  @Post('check')
  async checkAvailability(@Body() dto: CheckAvailabilityDto) {
    return this.availabilityService.checkAvailability(dto);
  }
}
