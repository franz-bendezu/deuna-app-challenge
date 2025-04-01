import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductCacheRepository } from './product-cache.repository';
import { Product } from '../../../domain/models/product.model';
import { RedisCache } from '../../../infrastructure/config/cache.config';

describe('ProductCacheRepository', () => {
  let repository: ProductCacheRepository;
  let mockCacheManager: jest.Mocked<RedisCache>;

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCacheRepository,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    repository = module.get<ProductCacheRepository>(ProductCacheRepository);
  });

  describe('create', () => {
    it('should add product to cache and return it', async () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCacheManager.get.mockResolvedValue([]);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await repository.create(product);

      expect(mockCacheManager.set).toHaveBeenCalledTimes(2);
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'product:1',
        product,
        3600,
      );
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'products',
        [product],
        3600,
      );
      expect(result).toEqual(product);
    });

    it('should update products list when adding new product', async () => {
      const existingProduct: Product = {
        id: '1',
        name: 'Existing Product',
        description: 'Existing Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newProduct: Product = {
        id: '2',
        name: 'New Product',
        description: 'New Description',
        price: 200,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCacheManager.get.mockResolvedValue([existingProduct]);
      mockCacheManager.set.mockResolvedValue(undefined);

      await repository.create(newProduct);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'products',
        [existingProduct, newProduct],
        3600,
      );
    });

    it('should update existing product in products list when adding with same id', async () => {
      const oldProduct: Product = {
        id: '1',
        name: 'Old Product',
        description: 'Old Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProduct: Product = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCacheManager.get.mockResolvedValue([oldProduct]);
      mockCacheManager.set.mockResolvedValue(undefined);

      await repository.create(updatedProduct);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'products',
        [updatedProduct],
        3600,
      );
    });
  });

  describe('findAll', () => {
    it('should return cached products when they exist', async () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          price: 100,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Test Product 2',
          description: 'Test Description 2',
          price: 200,
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(products);

      const result = await repository.findAll();

      expect(mockCacheManager.get).toHaveBeenCalledWith('products');
      expect(result).toEqual(products);
    });

    it('should return empty array when no cached products exist', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      const result = await repository.findAll();

      expect(mockCacheManager.get).toHaveBeenCalledWith('products');
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return cached product when it exists', async () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCacheManager.get.mockResolvedValue(product);

      const result = await repository.findById('1');

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(result).toEqual(product);
    });

    it('should return null when product does not exist in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(result).toBeNull();
    });
  });

  describe('updateById', () => {
    it('should update product in cache and return it when it exists', async () => {
      const existingProduct: Product = {
        id: '1',
        name: 'Original Product',
        description: 'Original Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateParams: Partial<Product> = {
        name: 'Updated Product',
        price: 150,
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateParams,
      };

      mockCacheManager.get.mockResolvedValueOnce(existingProduct);
      mockCacheManager.get.mockResolvedValueOnce([existingProduct]);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await repository.updateById('1', updatedProduct);

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'product:1',
        updatedProduct,
        3600,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should return null when product to update does not exist in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      const result = await repository.updateById('1', {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.set).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('updatePartialById', () => {
    it('should update partial product in cache and return it when it exists', async () => {
      const existingProduct: Product = {
        id: '1',
        name: 'Original Product',
        description: 'Original Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateParams: Partial<Product> = {
        name: 'Updated Product',
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateParams,
      };

      mockCacheManager.get.mockResolvedValueOnce(existingProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await repository.updatePartialById('1', updateParams);

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'product:1',
        updatedProduct,
        3600,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should return null when product to update does not exist in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      const result = await repository.updatePartialById('1', {
        name: 'Updated Product',
      });

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.set).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete product from cache and return true when it exists', async () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const otherProduct: Product = {
        id: '2',
        name: 'Other Product',
        description: 'Other Description',
        price: 200,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCacheManager.get.mockResolvedValueOnce(product);
      mockCacheManager.get.mockResolvedValueOnce([product, otherProduct]);
      mockCacheManager.del.mockResolvedValue(false);
      mockCacheManager.set.mockResolvedValue(null);

      const result = await repository.deleteById('1');

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.del).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'products',
        [otherProduct],
        3600,
      );
      expect(result).toBe(true);
    });

    it('should return false when product to delete does not exist in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      const result = await repository.deleteById('1');

      expect(mockCacheManager.get).toHaveBeenCalledWith('product:1');
      expect(mockCacheManager.del).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
