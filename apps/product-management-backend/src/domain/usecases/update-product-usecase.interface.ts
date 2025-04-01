import { CreateProduct } from '../models/create-product.model';
import { Product } from '../models/product.model';

export interface IUpdateProductUseCase {
  execute(this: void, id: string, params: CreateProduct): Promise<Product>;
}
