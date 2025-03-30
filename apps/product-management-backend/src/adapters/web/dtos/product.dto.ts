import { BaseProductDto } from './base-product.dto';

export class ProductDto extends BaseProductDto {
  constructor(
    public id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }
}
