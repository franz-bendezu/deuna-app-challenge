import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import envConfiguration from './config/env.config';
import { cacheRedisFactory } from './config/cache.config';
import { DB_CLIENT, PrismaService } from './config/database.config';
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
      provide: DB_CLIENT,
      useClass: PrismaService,
    },
    {
      provide: KAFKA_CLIENT,
      useFactory: kafkaClientFactory,
      inject: [ConfigService],
    },
  ],
  exports: [DB_CLIENT, KAFKA_CLIENT, CacheModule],
})
export class InfrastructureModule {}
