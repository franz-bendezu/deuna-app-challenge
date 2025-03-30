import { BaseProduct } from '../../../domain/models/base-product.model';
import { Product } from '../../../domain/models/product.model';
import { BaseProductDto } from '../dtos/base-product.dto';
import { ProductDto } from '../dtos/product.dto';

export class ProductMapper {
  static mapToDto(createdProduct: Product): ProductDto {
    return new ProductDto(
      createdProduct.id,
      createdProduct.name,
      createdProduct.description,
      createdProduct.price,
      createdProduct.stock,
    );
  }

  static mapDtoToProduct(dto: BaseProductDto): BaseProduct {
    return new BaseProduct(dto.name, dto.description, dto.price, dto.stock);
  }

  static mapDtoToUpdateParams(dto: ProductDto): BaseProduct {
    return new BaseProduct(dto.name, dto.description, dto.price, dto.stock);
  }
}
