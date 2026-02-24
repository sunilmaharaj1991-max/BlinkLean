import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { RedisCacheModule } from './config/redis.config';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { AvailabilityModule } from './availability/availability.module';
import { PaymentsModule } from './payments/payments.module';
import { ScrapModule } from './scrap/scrap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 20,
      },
    ]),
    DatabaseModule,
    RedisCacheModule,
    AuthModule,
    UsersModule,
    ZonesModule,
    ServicesModule,
    BookingsModule,
    AdminModule,
    AvailabilityModule,
    PaymentsModule,
    ScrapModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule { }
