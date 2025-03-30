import { BaseProduct } from '../../domain/models/base-product.model';
import { Product } from '../../domain/models/product.model';

export interface IProductRepository {
  create(this: void, params: BaseProduct): Promise<Product>;
  findAll(this: void): Promise<Product[]>;
  findById(this: void, id: string): Promise<Product | null>;
  updateById(
    this: void,
    id: string,
    params: BaseProduct,
  ): Promise<Product | null>;
  deleteById(this: void, id: string): Promise<boolean>;
}
