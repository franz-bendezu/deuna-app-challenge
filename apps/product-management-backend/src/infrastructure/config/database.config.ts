import { InjectionToken } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import {
  DatabaseConfig,
  EnvironmentConfig,
} from '../interfaces/env-config.interface';

export type DatabasePool = Pick<Pool, 'query'>;

export const DATABASE_POOL: InjectionToken<DatabasePool> =
  Symbol('DATABASE_POOL');

export const databasePoolFactory = (
  configService: ConfigService<EnvironmentConfig>,
) => {
  const dbConfig = configService.get<DatabaseConfig>('db');

  if (!dbConfig) {
    throw new Error('Database configuration is not defined');
  }
  return new Pool({
    user: dbConfig.username,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
  });
};
