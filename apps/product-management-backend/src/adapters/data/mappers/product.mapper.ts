import { Product } from '../../../domain/models/product.model';
import { IProductRow } from '../interfaces/product-row.interface';

export class ProductMapper {
  static fromRowtoEntity(data: IProductRow): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      data.price.toNumber(),
      data.stock,
      data.createdAt,
      data.updatedAt,
    );
  }
}
