import { ProductMapper } from './product.mapper';
import { Product } from '../../../domain/models/product.model';
import { IProductRow } from '../interfaces/product-row.interface';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductMapper', () => {
  describe('fromRowtoEntity', () => {
    it('should map IProductRow to Product correctly when price and stock are numbers', () => {
      const input: IProductRow = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: new Decimal(100),
        stock: 50,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const result = ProductMapper.fromRowtoEntity(input);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(input.id);
      expect(result.name).toBe(input.name);
      expect(result.description).toBe(input.description);
      expect(result.price).toBe(100);
      expect(result.stock).toBe(input.stock);
      expect(result.createdAt).toBe(input.createdAt);
      expect(result.updatedAt).toBe(input.updatedAt);
    });

    it('should map IProductRow to Product correctly when price and stock are strings', () => {
      const input: IProductRow = {
        id: '2',
        name: 'Another Product',
        description: 'Another Description',
        price: new Decimal('200'),
        stock: 30,
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-04'),
      };

      const result = ProductMapper.fromRowtoEntity(input);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(input.id);
      expect(result.name).toBe(input.name);
      expect(result.description).toBe(input.description);
      expect(result.price).toBe(200);
      expect(result.stock).toBe(30);
      expect(result.createdAt).toBe(input.createdAt);
      expect(result.updatedAt).toBe(input.updatedAt);
    });
  });
});
