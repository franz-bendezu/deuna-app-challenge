import { Keyv, createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { ConfigService } from '@nestjs/config';
import {
  CacheConfiguration,
  EnvironmentConfig,
} from '../interfaces/env-config.interface';

export const cacheRedisFactory = (
  configService: ConfigService<EnvironmentConfig>,
) => {
  const redisConfig = configService.get<CacheConfiguration>('redis');
  if (!redisConfig) {
    throw new Error('Redis configuration is not defined');
  }
  return {
    stores: [
      new Keyv({
        store: new CacheableMemory({
          ttl: redisConfig.ttl,
          lruSize: redisConfig.lruSize,
        }),
      }),
      createKeyv(redisConfig.url),
    ],
  };
};
