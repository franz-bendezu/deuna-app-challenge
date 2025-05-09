import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ISharedProduct } from '@app/shared';

@ApiSchema({
  description: 'DTO para representar un producto en el sistema',
})
export class ProductDTO extends CreateProductDto implements ISharedProduct {
  @ApiProperty({
    description: 'Identificador único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'Fecha de registro del producto en el sistema',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  fechaCreacion: Date;
  @ApiProperty({
    description: 'Fecha de la última modificación realizada',
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
