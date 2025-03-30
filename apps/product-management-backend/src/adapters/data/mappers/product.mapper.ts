import { Product } from '../../../domain/models/product.model';
import { IProductRow } from '../interfaces/product-row.interface';

export class ProductMapper {
  static fromRowtoEntity(data: IProductRow): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      typeof data.stock === 'string' ? parseInt(data.stock, 10) : data.stock,
      data.createdAt,
      data.updatedAt,
    );
  }
}
