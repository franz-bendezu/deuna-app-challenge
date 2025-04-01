import { IBaseSharedProduct } from '@app/shared';
import { Optional } from '@nestjs/common';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@ApiSchema({
  description: 'DTO base para representar un producto en el sistema',
})
export class BaseProductDto implements IBaseSharedProduct {
  @IsString()
  @Optional()
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone X10',
  })
  nombre?: string;

  @IsNotEmpty()
  @IsString()
  @Optional()
  @ApiProperty({
    description: 'Descripción detallada del producto',
    example:
      'Smartphone de última generación con cámara de 48MP y 128GB de almacenamiento',
  })
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Optional()
  @ApiProperty({
    description: 'Precio del producto en la moneda local',
    example: 599.99,
  })
  @Min(0)
  precio?: number;

  @IsInt()
  @Optional()
  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 50,
    type: 'integer',
  })
  @Min(0)
  stock?: number;
}
