import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { FindAllProductsUseCase } from './usecases/find-all-products.usecase';
import { FindProductByIdUseCase } from './usecases/find-product-by-id.usecase';
import { UpdateProductUseCase } from './usecases/update-product.usecase';
import { DeleteProductUseCase } from './usecases/delete-product.usecase';
import {
  CREATE_PRODUCT_USECASE,
  FIND_ALL_PRODUCTS_USECASE,
  FIND_PRODUCT_BY_ID_USECASE,
  UPDATE_PRODUCT_USECASE,
  DELETE_PRODUCT_USECASE,
  UPDATE__PARTIAL_PRODUCT_USECASE,
} from '../domain/constants/injection-tokens';
import { AdaptersDataModule } from '../adapters/data/data.module';
import { AdaptersMessagingModule } from '../adapters/messaging/messaging.module';

@Module({
  imports: [AdaptersDataModule, AdaptersMessagingModule],
  providers: [
    {
      provide: CREATE_PRODUCT_USECASE,
      useClass: CreateProductUseCase,
    },
    {
      provide: FIND_ALL_PRODUCTS_USECASE,
      useClass: FindAllProductsUseCase,
    },
    {
      provide: FIND_PRODUCT_BY_ID_USECASE,
      useClass: FindProductByIdUseCase,
    },
    {
      provide: UPDATE_PRODUCT_USECASE,
      useClass: UpdateProductUseCase,
    },
    {
      provide: DELETE_PRODUCT_USECASE,
      useClass: DeleteProductUseCase,
    },
    {
      provide: UPDATE__PARTIAL_PRODUCT_USECASE,
      useClass: UpdateProductUseCase,
    },
  ],
  exports: [
    CREATE_PRODUCT_USECASE,
    FIND_ALL_PRODUCTS_USECASE,
    FIND_PRODUCT_BY_ID_USECASE,
    UPDATE_PRODUCT_USECASE,
    DELETE_PRODUCT_USECASE,
    UPDATE__PARTIAL_PRODUCT_USECASE,
  ],
})
export class ApplicationModule {}
