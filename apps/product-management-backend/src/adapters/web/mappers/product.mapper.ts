import { BaseProduct } from '../../../domain/models/base-product.model';
import { Product } from '../../../domain/models/product.model';
import { BaseProductDto } from '../dtos/base-product.dto';
import { ProductDTO } from '../dtos/product.dto';

export class ProductMapper {
  static mapToDto(createdProduct: Product): ProductDTO {
    return new ProductDTO(
      createdProduct.id,
      createdProduct.name,
      createdProduct.description,
      createdProduct.price,
      createdProduct.stock,
      createdProduct.createdAt,
      createdProduct.updatedAt,
    );
  }

  static mapDtoToProduct(dto: BaseProductDto): BaseProduct {
    return new BaseProduct(dto.nombre, dto.descripcion, dto.precio, dto.stock);
  }

  static mapDtoToUpdateParams(dto: ProductDTO): BaseProduct {
    return new BaseProduct(dto.nombre, dto.descripcion, dto.precio, dto.stock);
  }
}
