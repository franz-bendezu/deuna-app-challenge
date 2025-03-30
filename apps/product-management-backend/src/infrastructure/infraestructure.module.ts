import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import envConfiguration from './config/env.config';
import { cacheRedisFactory } from './config/cache.config';
import { DATABASE_POOL, databasePoolFactory } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KAFKA_CLIENT, kafkaClientFactory } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
    }),
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: cacheRedisFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: databasePoolFactory,
      inject: [ConfigService],
    },
    {
      provide: KAFKA_CLIENT,
      useFactory: kafkaClientFactory,
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_POOL, KAFKA_CLIENT],
})
export class InfrastructureModule {}
