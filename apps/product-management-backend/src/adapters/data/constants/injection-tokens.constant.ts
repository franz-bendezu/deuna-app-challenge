import { InjectionToken } from '@nestjs/common';
import { IProductRepository } from '../../../application/repositories/product.repository.interface';

export const PRODUCT_DB_REPOSITORY: InjectionToken<IProductRepository> =
  'PRODUCT_DATABASE_REPOSITORY';
export const PRODUCT_CACHE_REPOSITORY: InjectionToken<IProductRepository> =
  'PRODUCT_CACHE_REPOSITORY';
