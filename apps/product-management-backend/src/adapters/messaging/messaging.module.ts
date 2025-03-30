import { Module } from '@nestjs/common';
import { ProductPublisher } from './publisher/product.publisher';
import { PRODUCT_PUBLISHER } from '../../domain/constants/injection-tokens';

@Module({
  providers: [
    {
      provide: PRODUCT_PUBLISHER,
      useClass: ProductPublisher,
    },
  ],
  exports: [PRODUCT_PUBLISHER],
})
export class AdaptersMessagingModule {}
