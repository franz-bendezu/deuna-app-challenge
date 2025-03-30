import { InjectionToken } from '@nestjs/common';
import { IProductRepository } from '../../application/repositories/product.repository.interface';
import { ICreateProductUseCase } from '../usecases/create-product-usecase.interface';
import { IFindAllProductsUseCase } from '../usecases/find-all-products-usecase.interface';
import { IFindProductByIdUseCase } from '../usecases/find-product-by-id-usecase.interface';
import { IUpdateProductUseCase } from '../usecases/update-product-usecase.interface';
import { IDeleteProductUseCase } from '../usecases/delete-product-usecase.interface';
import { IProductPublisher } from '../interfaces/event-publisher.interface';

// Repositories
export const PRODUCT_REPOSITORY: InjectionToken<IProductRepository> =
  'PRODUCT_REPOSITORY';
// Use Cases
export const CREATE_PRODUCT_USECASE: InjectionToken<ICreateProductUseCase> =
  'CREATE_PRODUCT_USECASE';
export const FIND_ALL_PRODUCTS_USECASE: InjectionToken<IFindAllProductsUseCase> =
  'FIND_ALL_PRODUCTS_USECASE';
export const FIND_PRODUCT_BY_ID_USECASE: InjectionToken<IFindProductByIdUseCase> =
  'FIND_PRODUCT_BY_ID_USECASE';
export const UPDATE_PRODUCT_USECASE: InjectionToken<IUpdateProductUseCase> =
  'UPDATE_PRODUCT_USECASE';
export const DELETE_PRODUCT_USECASE: InjectionToken<IDeleteProductUseCase> =
  'DELETE_PRODUCT_USECASE';

// Infrastructure
export const PRODUCT_PUBLISHER: InjectionToken<IProductPublisher> =
  'PRODUCT_PUBLISHER';
