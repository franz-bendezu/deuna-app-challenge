import { CreateProduct } from './create-product.model';

export class Product extends CreateProduct {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(name, description, price, stock);
  }
}
