import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from './create-product.usecase';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  PRODUCT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { IProductPublisher } from '../../domain/interfaces/event-publisher.interface';
import { Product } from '../../domain/models/product.model';
import { ProductEvents } from '../../domain/constants/events';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
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
        CreateProductUseCase,
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

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  describe('execute', () => {
    it('should create a product and publish an event', async () => {
      const productDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const createdProduct = new Product(
        '1',
        productDto.name,
        productDto.description,
        productDto.price,
        productDto.stock,
        new Date(),
        new Date(),
      );

      mockRepository.create.mockResolvedValue(createdProduct);

      const result = await useCase.execute(productDto);

      expect(mockRepository.create).toHaveBeenCalledWith(productDto);
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        ProductEvents.CREATED,
        createdProduct,
      );
      expect(result).toEqual(createdProduct);
    });
  });
});
