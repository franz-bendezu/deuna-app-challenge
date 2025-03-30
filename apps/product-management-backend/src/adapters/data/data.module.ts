import { Module } from '@nestjs/common';
import {
  PRODUCT_DB_REPOSITORY,
  PRODUCT_CACHE_REPOSITORY,
} from './constants/injection-tokens.constant';
import { ProductDatabaseRepository } from './repositories/product-database.repository';
import { ProductCacheRepository } from './repositories/product-cache.repository';
import { InfrastructureModule } from '../../infrastructure/infraestructure.module';
import { ProductRepository } from './repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';

@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: PRODUCT_DB_REPOSITORY,
      useClass: ProductDatabaseRepository,
    },
    {
      provide: PRODUCT_CACHE_REPOSITORY,
      useClass: ProductCacheRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class AdaptersDataModule {}
