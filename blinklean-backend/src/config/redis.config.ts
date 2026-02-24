import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const RedisCacheModule = CacheModule.registerAsync({
  isGlobal: true,
  useFactory: () => {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      return {
        store: redisStore,
        url: redisUrl,
        ttl: 300,
      } as any;
    }

    if (process.env.REDIS_HOST) {
      return {
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        ttl: 300,
      } as any;
    }

    // Default to in-memory for local development if no Redis is configured
    return {
      ttl: 300,
    } as any;
  },
});
