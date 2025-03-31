import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { BaseProductDto } from './base-product.dto';
import { ISharedProduct } from '@app/shared';

@ApiSchema({
  description: 'Product data transfer object',
})
export class ProductDTO extends BaseProductDto implements ISharedProduct {
  @ApiProperty({
    description: 'The unique identifier of the product, usually a UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'The date when the product was created',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  fechaCreacion: Date;
  @ApiProperty({
    description: 'The date when the product was last updated',
    example: '2023-10-02T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  fechaActualizacion: Date;
  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.nombre = name;
    this.descripcion = description;
    this.precio = price;
    this.stock = stock;
    this.id = id;
    this.fechaCreacion = createdAt;
    this.fechaActualizacion = updatedAt;
  }
}
