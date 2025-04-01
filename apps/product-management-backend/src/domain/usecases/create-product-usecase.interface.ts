import { CreateProduct } from '../models/create-product.model';
import { Product } from '../models/product.model';

export interface ICreateProductUseCase {
  execute(this: void, params: CreateProduct): Promise<Product>;
}
