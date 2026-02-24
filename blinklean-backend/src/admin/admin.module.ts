import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { Zone } from '../zones/zones.entity';
import { Booking } from '../bookings/bookings.entity';
import { Payment } from '../payments/payments.entity';
import { Service } from '../services/services.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Zone, Booking, Payment, Service]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
