import { Product } from '../models/product.model';

export interface IFindProductByIdUseCase {
  execute(this: void, id: string): Promise<Product>;
}
