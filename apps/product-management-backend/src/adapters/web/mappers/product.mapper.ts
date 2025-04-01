import { BaseProduct } from '../../../domain/models/base-product.model';
import { CreateProduct } from 'apps/product-management-backend/src/domain/models/create-product.model';
import { Product } from '../../../domain/models/product.model';
import { BaseProductDto } from '../dtos/base-product.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDTO } from '../dtos/product.dto';

export class ProductMapper {
  static mapDtoToPartialUpdateParams(updateProductDto: BaseProductDto) {
    return new BaseProduct(
      updateProductDto.nombre,
      updateProductDto.descripcion,
      updateProductDto.precio,
      updateProductDto.stock,
    );
  }
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

  static mapDtoToProduct(dto: CreateProductDto): CreateProduct {
    return new CreateProduct(
      dto.nombre,
      dto.descripcion,
      dto.precio,
      dto.stock,
    );
  }

  static mapDtoToUpdateParams(dto: ProductDTO): CreateProduct {
    return new CreateProduct(
      dto.nombre,
      dto.descripcion,
      dto.precio,
      dto.stock,
    );
  }
}
