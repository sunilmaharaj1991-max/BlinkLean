import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async storeOtp(phone: string, otp: string) {
    await this.cacheManager.set(phone, otp, 300); // 5 min expiry
  }

  async verifyOtp(phone: string, otp: string) {
    const storedOtp = await this.cacheManager.get(phone);
    return storedOtp === otp;
  }
}
