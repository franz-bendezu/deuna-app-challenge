import { IBaseSharedProduct } from '@app/shared';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@ApiSchema({
  description: 'Objeto base con los datos del producto',
})
export class BaseProductDto implements IBaseSharedProduct {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone X10',
  })
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Descripción detallada del producto',
    example:
      'Smartphone de última generación con cámara de 48MP y 128GB de almacenamiento',
  })
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({
    description: 'Precio del producto en la moneda local',
    example: 599.99,
  })
  @Min(0)
  precio: number;

  @IsInt()
  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 50,
    type: 'integer',
  })
  @Min(0)
  stock: number;
}
