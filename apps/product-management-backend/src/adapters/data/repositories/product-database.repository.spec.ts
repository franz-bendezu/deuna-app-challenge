import { Test, TestingModule } from '@nestjs/testing';
import { ProductDatabaseRepository } from './product-database.repository';
import {
  DATABASE_POOL,
  DatabasePool,
} from '../../../infrastructure/config/database.config';
import { Product } from '../../../domain/models/product.model';
import {
  QUERY_CREATE_PRODUCT,
  QUERY_DELETE_PRODUCT,
  QUERY_FIND_ALL_PRODUCTS,
  QUERY_FIND_PRODUCT_BY_ID,
  QUERY_UPDATE_PRODUCT,
} from './query/product.queries';
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

  describe('findById', () => {
    it('should return a product if found', async () => {
      const PRODUCT_ID = '1';
      const PRODUCT_NAME = 'Product 1';
      const PRODUCT_DESCRIPTION = 'Description 1';
      const PRODUCT_PRICE = 100;
      const PRODUCT_STOCK = 10;
      const PRODUCT_CREATED_AT = new Date();
      const PRODUCT_UPDATED_AT = new Date();
      const mockRow: IProductRow = {
        id: PRODUCT_ID,
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
        createdAt: PRODUCT_CREATED_AT,
        updatedAt: PRODUCT_UPDATED_AT,
      };
      const mockProduct = new Product(
        PRODUCT_ID,
        PRODUCT_NAME,
        PRODUCT_DESCRIPTION,
        PRODUCT_PRICE,
        PRODUCT_STOCK,
        PRODUCT_CREATED_AT,
        PRODUCT_UPDATED_AT,
      );

      mockPool.query.mockImplementation(() => {
        return {
          rows: [mockRow],
        };
      });

      const result = await repository.findById(PRODUCT_ID);

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_FIND_PRODUCT_BY_ID, [
        PRODUCT_ID,
      ]);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if no product is found', async () => {
      const PRODUCT_ID = '1';

      mockPool.query.mockImplementation(() => {
        return {
          rows: [],
        };
      });

      const result = await repository.findById(PRODUCT_ID);

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_FIND_PRODUCT_BY_ID, [
        PRODUCT_ID,
      ]);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a product and return it', async () => {
      const PRODUCT_ID = '1';
      const PRODUCT_NAME = 'Product 1';
      const PRODUCT_DESCRIPTION = 'Description 1';
      const PRODUCT_PRICE = 100;
      const PRODUCT_STOCK = 10;
      const PRODUCT_CREATED_AT = new Date();
      const PRODUCT_UPDATED_AT = new Date();
      const mockRow: IProductRow = {
        id: PRODUCT_ID,
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
        createdAt: PRODUCT_CREATED_AT,
        updatedAt: PRODUCT_UPDATED_AT,
      };
      const mockProduct = new Product(
        PRODUCT_ID,
        PRODUCT_NAME,
        PRODUCT_DESCRIPTION,
        PRODUCT_PRICE,
        PRODUCT_STOCK,
        PRODUCT_CREATED_AT,
        PRODUCT_UPDATED_AT,
      );

      mockPool.query.mockImplementation(() => {
        return {
          rows: [mockRow],
        };
      });

      const result = await repository.create({
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
      });

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_CREATE_PRODUCT, [
        PRODUCT_NAME,
        PRODUCT_DESCRIPTION,
        PRODUCT_PRICE,
        PRODUCT_STOCK,
      ]);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateById', () => {
    it('should update a product and return it', async () => {
      const PRODUCT_ID = '1';
      const PRODUCT_NAME = 'Updated Product';
      const PRODUCT_DESCRIPTION = 'Updated Description';
      const PRODUCT_PRICE = 150;
      const PRODUCT_STOCK = 15;
      const PRODUCT_CREATED_AT = new Date();
      const PRODUCT_UPDATED_AT = new Date();
      const mockRow: IProductRow = {
        id: PRODUCT_ID,
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
        createdAt: PRODUCT_CREATED_AT,
        updatedAt: PRODUCT_UPDATED_AT,
      };
      const mockProduct = new Product(
        PRODUCT_ID,
        PRODUCT_NAME,
        PRODUCT_DESCRIPTION,
        PRODUCT_PRICE,
        PRODUCT_STOCK,
        PRODUCT_CREATED_AT,
        PRODUCT_UPDATED_AT,
      );

      mockPool.query.mockImplementation(() => {
        return {
          rows: [mockRow],
        };
      });

      const result = await repository.updateById(PRODUCT_ID, {
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
      });

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_UPDATE_PRODUCT, [
        PRODUCT_NAME,
        PRODUCT_DESCRIPTION,
        PRODUCT_PRICE,
        PRODUCT_ID,
      ]);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if no product is updated', async () => {
      const PRODUCT_ID = '1';

      mockPool.query.mockImplementation(() => {
        return {
          rows: [],
        };
      });

      const result = await repository.updateById(PRODUCT_ID, {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 15,
      });

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_UPDATE_PRODUCT, [
        'Updated Product',
        'Updated Description',
        150,
        PRODUCT_ID,
      ]);
      expect(result).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete a product and return true', async () => {
      const PRODUCT_ID = '1';

      mockPool.query.mockImplementation(() => {
        return {
          rows: [{}],
        };
      });

      const result = await repository.deleteById(PRODUCT_ID);

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_DELETE_PRODUCT, [
        PRODUCT_ID,
      ]);
      expect(result).toBe(true);
    });

    it('should return false if no product is deleted', async () => {
      const PRODUCT_ID = '1';

      mockPool.query.mockImplementation(() => {
        return {
          rows: [],
        };
      });

      const result = await repository.deleteById(PRODUCT_ID);

      expect(mockPool.query).toHaveBeenCalledWith(QUERY_DELETE_PRODUCT, [
        PRODUCT_ID,
      ]);
      expect(result).toBe(false);
    });
  });
});
