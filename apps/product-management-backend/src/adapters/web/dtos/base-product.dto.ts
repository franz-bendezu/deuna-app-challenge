import { IBaseSharedProduct } from '@app/shared';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@ApiSchema({
  description: 'Base product data transfer object',
})
export class BaseProductDto implements IBaseSharedProduct {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The description of the product',
    example: 'Product Description',
  })
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
  })
  @Min(0)
  precio: number;

  @IsInt()
  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
    type: 'integer',
  })
  @Min(0)
  stock: number;
}
