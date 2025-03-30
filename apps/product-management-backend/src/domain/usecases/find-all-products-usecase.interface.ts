import { Product } from '../models/product.model';

export interface IFindAllProductsUseCase {
  execute(this: void): Promise<Product[]>;
}
