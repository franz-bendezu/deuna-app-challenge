import { BaseProduct } from '../models/base-product.model';
import { Product } from '../models/product.model';

export interface IUpdatePartialProductUseCase {
  execute(this: void, id: string, params: BaseProduct): Promise<Product>;
}
