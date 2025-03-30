import { ConfigService } from '@nestjs/config';
import { cacheRedisFactory } from './cache.config';
import {
  CacheConfiguration,
  EnvironmentConfig,
} from '../interfaces/env-config.interface';

describe('cacheRedisFactory', () => {
  let configService: ConfigService<EnvironmentConfig>;

  beforeEach(() => {
    configService = new ConfigService<EnvironmentConfig>();
  });

  it('should throw an error if Redis configuration is not defined', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => cacheRedisFactory(configService)).toThrowError(
      'Redis configuration is not defined',
    );
  });

  it('should return a valid cache configuration when Redis configuration is defined', () => {
    const mockRedisConfig: CacheConfiguration = {
      url: 'redis://localhost:6379',
      ttl: 3600,
      lruSize: 100,
    };

    jest.spyOn(configService, 'get').mockReturnValue(mockRedisConfig);

    const result = cacheRedisFactory(configService);

    expect(result).toHaveProperty('stores');
    expect(result.stores).toHaveLength(2);
  });
});
