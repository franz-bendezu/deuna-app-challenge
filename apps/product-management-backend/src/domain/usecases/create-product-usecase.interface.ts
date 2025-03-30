import { BaseProduct } from '../models/base-product.model';
import { Product } from '../models/product.model';

export interface ICreateProductUseCase {
  execute(this: void, params: BaseProduct): Promise<Product>;
}
