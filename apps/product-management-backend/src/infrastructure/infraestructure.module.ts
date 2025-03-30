import { Module } from '@nestjs/common';
import envConfiguration from './config/env.config';
import { DATABASE_POOL, databasePoolFactory } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
    }),
    ConfigModule,
  ],
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: databasePoolFactory,
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_POOL],
})
export class InfrastructureModule {}
