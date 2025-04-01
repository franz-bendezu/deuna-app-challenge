import { BaseProduct } from './base-product.model';

export class CreateProduct extends BaseProduct {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
  ) {
    super(name, description, price, stock);
  }
}
