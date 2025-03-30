import { Test, TestingModule } from '@nestjs/testing';
import { FindProductByIdUseCase } from './find-product-by-id.usecase';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { Product } from '../../domain/models/product.model';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';

describe('FindProductByIdUseCase', () => {
  let useCase: FindProductByIdUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProductByIdUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindProductByIdUseCase>(FindProductByIdUseCase);
  });

  describe('execute', () => {
    it('should return a product when found', async () => {
      const productId = '1';
      const mockProduct = new Product(
        productId,
        'Test Product',
        'Test Description',
        100,
        10,
        new Date(),
        new Date(),
      );

      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await useCase.execute(productId);

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should throw ProductNotFoundException when product is not found', async () => {
      const productId = '999';

      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(productId)).rejects.toThrow(
        new ProductNotFoundException(productId),
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
    });
  });
});
