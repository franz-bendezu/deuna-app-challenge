import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { databasePoolFactory } from './database.config';
import {
  EnvironmentConfig,
  DatabaseConfig,
} from '../interfaces/env-config.interface';

describe('databasePoolFactory', () => {
  let configService: ConfigService<EnvironmentConfig>;

  beforeEach(() => {
    configService = new ConfigService<EnvironmentConfig>();
  });

  it('should throw an error if database configuration is not defined', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => databasePoolFactory(configService)).toThrowError(
      'Database configuration is not defined',
    );
  });

  it('should create a new Pool instance with the correct configuration', () => {
    const mockDbConfig: DatabaseConfig = {
      username: 'test_user',
      host: 'localhost',
      database: 'test_db',
      password: 'test_password',
      port: 5432,
    };

    jest.spyOn(configService, 'get').mockReturnValue(mockDbConfig);

    const pool = databasePoolFactory(configService);

    expect(pool).toBeInstanceOf(Pool);
    expect(pool).toHaveProperty('query');
  });
});
