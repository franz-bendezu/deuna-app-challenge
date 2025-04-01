import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductUseCase } from './delete-product.usecase';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  PRODUCT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { IProductPublisher } from '../../domain/interfaces/event-publisher.interface';
import { Product } from '../../domain/models/product.model';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import { ProductEvents } from '../../domain/constants/events';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;
  let mockPublisher: jest.Mocked<IProductPublisher>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      updatePartialById: jest.fn(),
    };

    mockPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: PRODUCT_PUBLISHER,
          useValue: mockPublisher,
        },
      ],
    }).compile();

    useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
  });

  describe('execute', () => {
    it('should delete a product and publish an event', async () => {
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

      // Mock the findById to return a product
      mockRepository.findById.mockResolvedValue(mockProduct);
      // Mock the deleteById to return true (success)
      mockRepository.deleteById.mockResolvedValue(true);

      await useCase.execute(productId);

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockRepository.deleteById).toHaveBeenCalledWith(productId);
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        ProductEvents.DELETED,
        mockProduct,
      );
    });

    it('should throw ProductNotFoundException when product is not found during initial check', async () => {
      const productId = '999';

      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(productId)).rejects.toThrow(
        new ProductNotFoundException(productId),
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockRepository.deleteById).not.toHaveBeenCalled();
      expect(mockPublisher.publish).not.toHaveBeenCalled();
    });

    it('should throw ProductNotFoundException when product deletion fails', async () => {
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
      mockRepository.deleteById.mockResolvedValue(false);

      await expect(useCase.execute(productId)).rejects.toThrow(
        new ProductNotFoundException(productId),
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockRepository.deleteById).toHaveBeenCalledWith(productId);
      expect(mockPublisher.publish).not.toHaveBeenCalled();
    });
  });
});
