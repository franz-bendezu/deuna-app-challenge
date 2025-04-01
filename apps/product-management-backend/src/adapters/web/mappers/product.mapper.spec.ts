import { ProductMapper } from './product.mapper';
import { Product } from '../../../domain/models/product.model';
import { ProductDTO } from '../dtos/product.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProduct } from 'apps/product-management-backend/src/domain/models/create-product.model';

describe('ProductMapper', () => {
  describe('mapToDto', () => {
    it('should map a Product to a ProductDto correctly', () => {
      const product: Product = {
        id: '123',
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedDto: ProductDTO = new ProductDTO(
        '123',
        'Test Product',
        'This is a test product',
        100,
        50,
        product.createdAt,
        product.updatedAt,
      );

      const result = ProductMapper.mapToDto(product);

      expect(result).toEqual(expectedDto);
    });
  });

  describe('mapDtoToProduct', () => {
    it('should map a BaseProductDto to a BaseProduct correctly', () => {
      const dto: CreateProductDto = {
        nombre: 'Test Product',
        descripcion: 'This is a test product',
        precio: 100,
        stock: 50,
      };

      const expectedProduct: CreateProduct = new CreateProduct(
        'Test Product',
        'This is a test product',
        100,
        50,
      );
      const result = ProductMapper.mapDtoToProduct(dto);

      expect(result).toEqual(expectedProduct);
    });
  });

  describe('mapDtoToUpdateParams', () => {
    it('should map a ProductDto to a BaseProduct correctly', () => {
      const dto: ProductDTO = new ProductDTO(
        '123',
        'Updated Product',
        'This is an updated product',
        150,
        30,
        new Date(),
        new Date(),
      );

      const expectedProduct: CreateProduct = new CreateProduct(
        'Updated Product',
        'This is an updated product',
        150,
        30,
      );

      const result = ProductMapper.mapDtoToUpdateParams(dto);

      expect(result).toEqual(expectedProduct);
    });
  });
});
