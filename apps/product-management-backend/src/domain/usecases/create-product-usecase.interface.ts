import { BaseProduct } from '../models/base-product.model';
import { Product } from '../models/product.model';

export interface ICreateProductUseCase {
  execute(params: BaseProduct): Promise<Product>;
}
