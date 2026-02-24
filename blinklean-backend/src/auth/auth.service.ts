import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(phone: string) {
    const otp = this.generateOtp();

    await this.cacheManager.set(phone, otp, 300); // 5 minutes expiry

    // integrate SMS provider here
    console.log(`OTP for ${phone}: ${otp}`);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string) {
    const storedOtp = await this.cacheManager.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.cacheManager.del(phone);

    const token = this.jwtService.sign({ phone });

    return {
      message: 'Login successful',
      access_token: token,
    };
  }
}
