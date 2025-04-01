import { BaseProduct } from '../../domain/models/base-product.model';
import { CreateProduct } from '../../domain/models/create-product.model';
import { Product } from '../../domain/models/product.model';

export interface IProductRepository {
  create(this: void, params: CreateProduct): Promise<Product>;
  findAll(this: void): Promise<Product[]>;
  findById(this: void, id: string): Promise<Product | null>;
  updateById(
    this: void,
    id: string,
    params: CreateProduct,
  ): Promise<Product | null>;
  updatePartialById(
    this: void,
    id: string,
    params: BaseProduct,
  ): Promise<Product | null>;
  deleteById(this: void, id: string): Promise<boolean>;
}
