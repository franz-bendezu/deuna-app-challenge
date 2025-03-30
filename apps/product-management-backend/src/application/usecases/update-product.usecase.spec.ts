import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductUseCase } from './update-product.usecase';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  PRODUCT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { IProductPublisher } from '../../domain/interfaces/event-publisher.interface';
import { Product } from '../../domain/models/product.model';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import { ProductEvents } from '../../domain/constants/events';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;
  let mockPublisher: jest.Mocked<IProductPublisher>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    mockPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
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

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
  });

  describe('execute', () => {
    it('should update a product and publish an event', async () => {
      const productId = '1';
      const updateDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 15,
      };

      const updatedProduct = new Product(
        productId,
        updateDto.name,
        updateDto.description,
        updateDto.price,
        updateDto.stock,
        new Date(),
        new Date(),
      );

      mockRepository.updateById.mockResolvedValue(updatedProduct);

      const result = await useCase.execute(productId, updateDto);

      expect(mockRepository.updateById).toHaveBeenCalledWith(
        productId,
        updateDto,
      );
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        ProductEvents.UPDATED,
        updatedProduct,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw ProductNotFoundException when product is not found', async () => {
      const productId = '999';
      const updateDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 15,
      };

      mockRepository.updateById.mockResolvedValue(null);

      await expect(useCase.execute(productId, updateDto)).rejects.toThrow(
        new ProductNotFoundException(productId),
      );

      expect(mockRepository.updateById).toHaveBeenCalledWith(
        productId,
        updateDto,
      );
      expect(mockPublisher.publish).not.toHaveBeenCalled();
    });
  });
});
