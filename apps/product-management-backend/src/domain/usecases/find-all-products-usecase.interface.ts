import { Product } from '../models/product.model';

export interface IFindAllProductsUseCase {
  execute(): Promise<Product[]>;
}
