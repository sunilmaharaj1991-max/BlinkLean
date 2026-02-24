import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.entity';
import { Zone } from '../zones/zones.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Zone, User])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
