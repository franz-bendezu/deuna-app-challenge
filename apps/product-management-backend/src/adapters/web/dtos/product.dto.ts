import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { BaseProductDto } from './base-product.dto';

@ApiSchema({
  description: 'Product data transfer object',
})
export class ProductDto extends BaseProductDto {
  @ApiProperty({
    description: 'The unique identifier of the product, usually a UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;
  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
  ) {
    super();
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.id = id;
  }
}
