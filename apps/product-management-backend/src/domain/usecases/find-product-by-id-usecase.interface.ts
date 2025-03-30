import { Product } from '../models/product.model';

export interface IFindProductByIdUseCase {
  execute(id: string): Promise<Product>;
}
