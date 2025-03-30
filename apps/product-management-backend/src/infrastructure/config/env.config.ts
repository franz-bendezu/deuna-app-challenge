import { EnvironmentConfig } from '../interfaces/env-config.interface';

export default (): EnvironmentConfig => ({
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'product_management',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.REDIS_TTL || '60000'),
    lruSize: parseInt(process.env.REDIS_LRU_SIZE || '5000'),
  },
});
