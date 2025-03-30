import { ProductMapper } from './product.mapper';
import { Product } from '../../../domain/models/product.model';
import { IProductRow } from '../interfaces/product-row.interface';

describe('ProductMapper', () => {
  describe('fromRowtoEntity', () => {
    it('should map IProductRow to Product correctly when price and stock are numbers', () => {
      const input: IProductRow = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const result = ProductMapper.fromRowtoEntity(input);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(input.id);
      expect(result.name).toBe(input.name);
      expect(result.description).toBe(input.description);
      expect(result.price).toBe(input.price);
      expect(result.stock).toBe(input.stock);
      expect(result.createdAt).toBe(input.createdAt);
      expect(result.updatedAt).toBe(input.updatedAt);
    });

    it('should map IProductRow to Product correctly when price and stock are strings', () => {
      const input: IProductRow = {
        id: '2',
        name: 'Another Product',
        description: 'Another Description',
        price: '200',
        stock: '30',
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-04'),
      };

      const result = ProductMapper.fromRowtoEntity(input);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(input.id);
      expect(result.name).toBe(input.name);
      expect(result.description).toBe(input.description);
      expect(result.price).toBe(200); // parsed from string
      expect(result.stock).toBe(30); // parsed from string
      expect(result.createdAt).toBe(input.createdAt);
      expect(result.updatedAt).toBe(input.updatedAt);
    });

    it('should handle invalid numeric strings gracefully', () => {
      const input: IProductRow = {
        id: '3',
        name: 'Invalid Product',
        description: 'Invalid Description',
        price: 'invalid',
        stock: 'invalid',
        createdAt: new Date('2023-01-05'),
        updatedAt: new Date('2023-01-06'),
      };

      const result = ProductMapper.fromRowtoEntity(input);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(input.id);
      expect(result.name).toBe(input.name);
      expect(result.description).toBe(input.description);
      expect(result.price).toBeNaN(); // parseFloat('invalid') results in NaN
      expect(result.stock).toBeNaN(); // parseInt('invalid', 10) results in NaN
      expect(result.createdAt).toBe(input.createdAt);
      expect(result.updatedAt).toBe(input.updatedAt);
    });
  });
});
