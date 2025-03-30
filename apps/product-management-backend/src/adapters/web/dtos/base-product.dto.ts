import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  description: 'Base product data transfer object',
})
export class BaseProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The description of the product',
    example: 'Product Description',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
  })
  price: number;

  @IsInt()
  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
    type: 'integer',
  })
  stock: number;
}
