import { Test, TestingModule } from '@nestjs/testing';
import { ProductDatabaseRepository } from './product-database.repository';
import {
  DB_CLIENT,
  DBClientProduct,
} from '../../../infrastructure/config/database.config';
import { Product } from '../../../domain/models/product.model';
import { IProductRow } from '../interfaces/product-row.interface';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductDatabaseRepository', () => {
  let repository: ProductDatabaseRepository;
  let mockPrismaClient: jest.Mocked<{
    product: jest.Mocked<DBClientProduct>;
  }>;

  beforeEach(async () => {
    mockPrismaClient = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductDatabaseRepository,
        {
          provide: DB_CLIENT,
          useValue: mockPrismaClient,
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
          price: new Decimal(PRODUCT_PRICE_1),
          stock: PRODUCT_STOCK_1,
          createdAt: PRODUCT_CREATED_AT_1,
          updatedAt: PRODUCT_UPDATED_AT_1,
        },
        {
          id: PRODUCT_ID_2,
          name: PRODUCT_NAME_2,
          description: PRODUCT_DESCRIPTION_2,
          price: new Decimal(PRODUCT_PRICE_2),
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

      mockPrismaClient.product.findMany.mockResolvedValue(mockRows);

      const result = await repository.findAll();

      expect(mockPrismaClient.product.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return an empty array if no products are found', async () => {
      mockPrismaClient.product.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(mockPrismaClient.product.findMany).toHaveBeenCalled();
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
        price: new Decimal(PRODUCT_PRICE),
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

      mockPrismaClient.product.findUnique.mockResolvedValue(mockRow);

      const result = await repository.findById(PRODUCT_ID);

      expect(mockPrismaClient.product.findUnique).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if no product is found', async () => {
      const PRODUCT_ID = '1';

      mockPrismaClient.product.findUnique.mockResolvedValue(null);

      const result = await repository.findById(PRODUCT_ID);

      expect(mockPrismaClient.product.findUnique).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
      });
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
        price: new Decimal(PRODUCT_PRICE),
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

      mockPrismaClient.product.create.mockResolvedValue(mockRow);

      const result = await repository.create({
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
      });

      expect(mockPrismaClient.product.create).toHaveBeenCalledWith({
        data: {
          name: PRODUCT_NAME,
          description: PRODUCT_DESCRIPTION,
          price: PRODUCT_PRICE,
          stock: PRODUCT_STOCK,
        },
      });
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
        price: new Decimal(PRODUCT_PRICE),
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

      mockPrismaClient.product.update.mockResolvedValue(mockRow);

      const result = await repository.updateById(PRODUCT_ID, {
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
      });

      expect(mockPrismaClient.product.update).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        data: {
          name: PRODUCT_NAME,
          description: PRODUCT_DESCRIPTION,
          price: PRODUCT_PRICE,
          stock: PRODUCT_STOCK,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if no product is updated', async () => {
      const PRODUCT_ID = '1';
      const PRODUCT_NAME = 'Updated Product';
      const PRODUCT_DESCRIPTION = 'Updated Description';
      const PRODUCT_PRICE = 150;
      const PRODUCT_STOCK = 15;

      mockPrismaClient.product.update.mockRejectedValue(
        new Error('Product not found'),
      );

      const result = await repository.updateById(PRODUCT_ID, {
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
        price: PRODUCT_PRICE,
        stock: PRODUCT_STOCK,
      });

      expect(mockPrismaClient.product.update).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        data: {
          name: PRODUCT_NAME,
          description: PRODUCT_DESCRIPTION,
          price: PRODUCT_PRICE,
          stock: PRODUCT_STOCK,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete a product and return true', async () => {
      const PRODUCT_ID = '1';

      mockPrismaClient.product.delete.mockResolvedValue({
        id: PRODUCT_ID,
        name: 'Product 1',
        description: 'Description 1',
        price: new Decimal(100),
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await repository.deleteById(PRODUCT_ID);

      expect(mockPrismaClient.product.delete).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
      });
      expect(result).toBe(true);
    });

    it('should return false if no product is deleted', async () => {
      const PRODUCT_ID = '1';

      mockPrismaClient.product.delete.mockRejectedValue(
        new Error('Product not found'),
      );

      const result = await repository.deleteById(PRODUCT_ID);

      expect(mockPrismaClient.product.delete).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
      });
      expect(result).toBe(false);
    });
  });
});
