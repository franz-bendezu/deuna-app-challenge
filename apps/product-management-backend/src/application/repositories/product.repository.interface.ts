import { BaseProduct } from '../../domain/models/base-product.model';
import { Product } from '../../domain/models/product.model';

export interface IProductRepository {
  create(params: BaseProduct): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  updateById(id: string, params: BaseProduct): Promise<Product | null>;
  deleteById(id: string): Promise<boolean>;
}
