import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { CreateScrapBookingDto } from './dto/create-scrap-booking.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('scrap')
  async createScrapBooking(@Req() req, @Body() dto: CreateScrapBookingDto) {
    return this.bookingsService.createScrapBooking(req.user.phone, dto);
  }
}
