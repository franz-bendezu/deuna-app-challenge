import { BaseProduct } from './base-product.model';

export class Product extends BaseProduct {
  constructor(
    public id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
  ) {
    super(name, description, price, stock);
  }
}
