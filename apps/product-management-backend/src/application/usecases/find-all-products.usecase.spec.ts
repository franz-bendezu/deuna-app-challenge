import { Test, TestingModule } from '@nestjs/testing';
import { FindAllProductsUseCase } from './find-all-products.usecase';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { Product } from '../../domain/models/product.model';

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
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
        FindAllProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllProductsUseCase>(FindAllProductsUseCase);
  });

  describe('execute', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        new Product(
          '1',
          'Product 1',
          'Description 1',
          100,
          10,
          new Date(),
          new Date(),
        ),
        new Product(
          '2',
          'Product 2',
          'Description 2',
          200,
          20,
          new Date(),
          new Date(),
        ),
      ];

      mockRepository.findAll.mockResolvedValue(mockProducts);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return an empty array if no products exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
