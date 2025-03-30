import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infraestructure.module';
import { ProductRepository } from './repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';

@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
})
export class AdaptersDataModule {}
