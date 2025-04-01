import { CreateProduct } from './create-product.model';

export class Product extends CreateProduct {
  constructor(
    public id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(name, description, price, stock);
  }
}
