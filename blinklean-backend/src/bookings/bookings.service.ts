import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Booking } from './bookings.entity';
import { Zone } from '../zones/zones.entity';
import { User } from '../users/users.entity';
import { CreateScrapBookingDto } from './dto/create-scrap-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async createScrapBooking(phone: string, dto: CreateScrapBookingDto) {
    const { pickup_address, pincode, selected_materials, estimated_weight, predicted_price, pickup_date } = dto;

    // 1. Validate Date (must be future)
    const bookingDate = new Date(pickup_date);
    if (bookingDate <= new Date()) {
      throw new BadRequestException('Pickup date must be in the future');
    }

    // 2. Anti-spam/Duplicate prevent caching (10 seconds)
    const cacheKey = `booking_spam_${phone}`;
    const recentBooking = await this.cacheManager.get(cacheKey);
    if (recentBooking) {
      throw new ConflictException(
        'Please wait before requesting another booking',
      );
    }

    // 3. Check service zone availability
    const zone = await this.zonesRepository.findOne({
      where: { pincode, is_active: true },
    });

    if (!zone) {
      throw new BadRequestException(
        'Service is not available in your area yet',
      );
    }

    if (!zone.scrap_service_available) {
      throw new BadRequestException(
        'Scrap service is currently not available for this pincode',
      );
    }

    // 4. Get User
    let user = await this.usersRepository.findOne({
      where: { phone_number: phone },
    });
    if (!user) {
      // usually users are created in OTP flow, handle if new here just in case
      user = this.usersRepository.create({ phone_number: phone });
      user = await this.usersRepository.save(user);
    }

    // 5. Create Booking using Transaction Simulation via Save
    const booking = this.bookingsRepository.create({
      user,
      pickup_address,
      pincode,
      selected_materials,
      estimated_weight,
      predicted_price,
      pickup_date,
      status: 'scheduled',
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    // 6. Lock submissions for this user for 10 seconds
    await this.cacheManager.set(cacheKey, 'locked', 10);

    return {
      message: 'Scrap pickup scheduled successfully',
      bookingId: savedBooking.id,
      status: savedBooking.status,
    };
  }
}
