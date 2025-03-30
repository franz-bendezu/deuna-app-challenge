import { Test, TestingModule } from '@nestjs/testing';
import { ProductDatabaseRepository } from './product-database.repository';
import {
  DATABASE_POOL,
  DatabasePool,
} from '../../../infrastructure/config/database.config';
import { Product } from '../../../domain/models/product.model';
import { QUERY_FIND_ALL_PRODUCTS } from './query/product.queries';
import { IProductRow } from '../interfaces/product-row.interface';

describe('ProductDatabaseRepository', () => {
  let repository: ProductDatabaseRepository;
  let mockPool: jest.Mocked<DatabasePool>;

  beforeEach(async () => {
    mockPool = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductDatabaseRepository,
        {
          provide: DATABASE_POOL,
          useValue: mockPool,
        },
      ],
    }).compile();

    repository = module.get<ProductDatabaseRepository>(
      ProductDatabaseRepository,
    );
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const PRODUCT_ID_1 = '1';
      const PRODUCT_ID_2 = '2';
      const PRODUCT_NAME_1 = 'Product 1';
      const PRODUCT_NAME_2 = 'Product 2';
      const PRODUCT_DESCRIPTION_1 = 'Description 1';
      const PRODUCT_DESCRIPTION_2 = 'Description 2';
      const PRODUCT_PRICE_1 = 100;
      const PRODUCT_PRICE_2 = 200;
      const PRODUCT_STOCK_1 = 10;
      const PRODUCT_STOCK_2 = 20;
      const PRODUCT_CREATED_AT_1 = new Date();
      const PRODUCT_CREATED_AT_2 = new Date();
      const PRODUCT_UPDATED_AT_1 = new Date();
      const PRODUCT_UPDATED_AT_2 = new Date();
      const mockRows: IProductRow[] = [
        {
          id: PRODUCT_ID_1,
          name: PRODUCT_NAME_1,
          description: PRODUCT_DESCRIPTION_1,
          price: PRODUCT_PRICE_1,
          stock: PRODUCT_STOCK_1,
          createdAt: PRODUCT_CREATED_AT_1,
          updatedAt: PRODUCT_UPDATED_AT_1,
        },
        {
          id: PRODUCT_ID_2,
          name: PRODUCT_NAME_2,
          description: PRODUCT_DESCRIPTION_2,
          price: PRODUCT_PRICE_2,
          stock: PRODUCT_STOCK_2,
          createdAt: PRODUCT_CREATED_AT_2,
          updatedAt: PRODUCT_UPDATED_AT_2,
        },
      ];
      const mockProducts = [
        new Product(
          PRODUCT_ID_1,
          PRODUCT_NAME_1,
          PRODUCT_DESCRIPTION_1,
          PRODUCT_PRICE_1,
          PRODUCT_STOCK_1,
          PRODUCT_CREATED_AT_1,
          PRODUCT_UPDATED_AT_1,
        ),
        new Product(
          PRODUCT_ID_2,
          PRODUCT_NAME_2,
          PRODUCT_DESCRIPTION_2,
          PRODUCT_PRICE_2,
          PRODUCT_STOCK_2,
          PRODUCT_CREATED_AT_2,
          PRODUCT_UPDATED_AT_2,
        ),
      ];

      mockPool.query.mockImplementation(() => {
        return {
          rows: mockRows,
        };
      });

      const result = await repository.findAll();

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_FIND_ALL_PRODUCTS);
      expect(result).toEqual(mockProducts);
    });

    it('should return an empty array if no products are found', async () => {
      mockPool.query.mockImplementation(() => {
        return {
          rows: [],
        };
      });

      const result = await repository.findAll();

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_FIND_ALL_PRODUCTS);
      expect(result).toEqual([]);
    });
  });
});
