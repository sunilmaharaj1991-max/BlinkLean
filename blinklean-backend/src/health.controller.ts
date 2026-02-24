import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('health')
export class HealthController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @Get()
  check() {
    return {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  @Get('redis-test')
  async testCache() {
    await this.cacheManager.set('test', 'working', 60);
    return this.cacheManager.get('test');
  }
}
