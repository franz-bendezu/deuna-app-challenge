import { ProductRepository } from './product.repository';
import { IProductRepository } from '../../../application/repositories/product.repository.interface';
import { CreateProduct } from 'apps/product-management-backend/src/domain/models/create-product.model';
import { Product } from '../../../domain/models/product.model';
import {
  PRODUCT_CACHE_REPOSITORY,
  PRODUCT_DB_REPOSITORY,
} from '../constants/injection-tokens.constant';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let productDatabaseRepository: jest.Mocked<IProductRepository>;
  let productCacheRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    productDatabaseRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      updatePartialById: jest.fn(),
    };

    productCacheRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      updatePartialById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        { provide: PRODUCT_DB_REPOSITORY, useValue: productDatabaseRepository },
        { provide: PRODUCT_CACHE_REPOSITORY, useValue: productCacheRepository },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should create a product and cache it', async () => {
    const baseProduct: CreateProduct = {
      name: 'Test Product',
      price: 100,
      description: '',
      stock: 0,
    };
    const createdProduct: Product = {
      id: '1',
      ...baseProduct,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    productDatabaseRepository.create.mockResolvedValue(createdProduct);
    productCacheRepository.create.mockResolvedValue(createdProduct);

    const result = await productRepository.create(baseProduct);

    expect(productDatabaseRepository.create).toHaveBeenCalledWith(baseProduct);
    expect(productCacheRepository.create).toHaveBeenCalledWith(createdProduct);
    expect(result).toEqual(createdProduct);
  });

  it('should return cached products if available', async () => {
    const cachedProducts: Product[] = [
      {
        id: '1',
        name: 'Cached Product',
        price: 50,

        createdAt: new Date(),

        updatedAt: new Date(),
        description: '',
        stock: 0,
      },
    ];

    productCacheRepository.findAll.mockResolvedValue(cachedProducts);

    const result = await productRepository.findAll();

    expect(productCacheRepository.findAll).toHaveBeenCalled();
    expect(productDatabaseRepository.findAll).not.toHaveBeenCalled();
    expect(result).toEqual(cachedProducts);
  });

  it('should fetch products from the database if cache is empty', async () => {
    const dbProducts: Product[] = [
      {
        id: '1',
        name: 'DB Product',
        price: 100,
        createdAt: new Date(),

        updatedAt: new Date(),
        description: '',
        stock: 0,
      },
    ];

    productCacheRepository.findAll.mockResolvedValue([]);
    productDatabaseRepository.findAll.mockResolvedValue(dbProducts);

    const result = await productRepository.findAll();

    expect(productCacheRepository.findAll).toHaveBeenCalled();
    expect(productDatabaseRepository.findAll).toHaveBeenCalled();
    expect(productCacheRepository.create).toHaveBeenCalledTimes(
      dbProducts.length,
    );
    expect(result).toEqual(dbProducts);
  });

  it('should return a cached product if available', async () => {
    const cachedProduct: Product = {
      id: '1',
      name: 'Cached Product',
      price: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: '',
      stock: 0,
    };

    productCacheRepository.findById.mockResolvedValue(cachedProduct);

    const result = await productRepository.findById('1');

    expect(productCacheRepository.findById).toHaveBeenCalledWith('1');
    expect(productDatabaseRepository.findById).not.toHaveBeenCalled();
    expect(result).toEqual(cachedProduct);
  });

  it('should fetch a product from the database if not cached', async () => {
    const dbProduct: Product = {
      id: '1',
      name: 'DB Product',
      price: 100,

      createdAt: new Date(),

      updatedAt: new Date(),
      description: '',
      stock: 0,
    };

    productCacheRepository.findById.mockResolvedValue(null);
    productDatabaseRepository.findById.mockResolvedValue(dbProduct);

    const result = await productRepository.findById('1');

    expect(productCacheRepository.findById).toHaveBeenCalledWith('1');
    expect(productDatabaseRepository.findById).toHaveBeenCalledWith('1');
    expect(productCacheRepository.create).toHaveBeenCalledWith(dbProduct);
    expect(result).toEqual(dbProduct);
  });

  it('should update a product and cache the updated product', async () => {
    const updatedProduct: Product = {
      id: '1',
      name: 'Updated Product',
      price: 150,

      createdAt: new Date(),

      updatedAt: new Date(),
      description: '',
      stock: 0,
    };
    const baseProduct: CreateProduct = {
      name: 'Updated Product',
      price: 150,
      description: '',
      stock: 0,
    };

    productDatabaseRepository.updateById.mockResolvedValue(updatedProduct);

    const result = await productRepository.updateById('1', baseProduct);

    expect(productDatabaseRepository.updateById).toHaveBeenCalledWith(
      '1',
      baseProduct,
    );
    expect(productCacheRepository.updateById).toHaveBeenCalledWith(
      '1',
      updatedProduct,
    );
    expect(result).toEqual(updatedProduct);
  });

  it('should update a product partially and cache the updated product', async () => {
    const updatedProduct: Product = {
      id: '1',
      name: 'Partially Updated Product',
      price: 100,

      createdAt: new Date(),

      updatedAt: new Date(),
      description: '',
      stock: 0,
    };
    const partialUpdate = { name: 'Partially Updated Product' };

    productDatabaseRepository.updatePartialById.mockResolvedValue(
      updatedProduct,
    );

    const result = await productRepository.updatePartialById(
      '1',
      partialUpdate,
    );

    expect(productDatabaseRepository.updatePartialById).toHaveBeenCalledWith(
      '1',
      partialUpdate,
    );
    expect(productCacheRepository.updateById).toHaveBeenCalledWith(
      '1',
      updatedProduct,
    );
    expect(result).toEqual(updatedProduct);
  });

  it('should delete a product from both database and cache', async () => {
    productDatabaseRepository.deleteById.mockResolvedValue(true);

    const result = await productRepository.deleteById('1');

    expect(productDatabaseRepository.deleteById).toHaveBeenCalledWith('1');
    expect(productCacheRepository.deleteById).toHaveBeenCalledWith('1');
    expect(result).toBe(true);
  });
});
