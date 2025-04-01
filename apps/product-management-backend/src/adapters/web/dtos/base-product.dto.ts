import { IBaseSharedProduct } from '@app/shared';
import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

@ApiSchema({
  description: 'DTO base para representar un producto en el sistema',
})
export class BaseProductDto
  extends PartialType(CreateProductDto)
  implements IBaseSharedProduct {}
