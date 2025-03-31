import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { IFindAllProductsUseCase } from '../../../domain/usecases/find-all-products-usecase.interface';
import {
  CREATE_PRODUCT_USECASE,
  DELETE_PRODUCT_USECASE,
  FIND_ALL_PRODUCTS_USECASE,
  FIND_PRODUCT_BY_ID_USECASE,
  UPDATE_PRODUCT_USECASE,
} from '../../../domain/constants/injection-tokens';
import { ProductMapper } from '../mappers/product.mapper';
import { Product } from '../../../domain/models/product.model';
import { ICreateProductUseCase } from '../../../domain/usecases/create-product-usecase.interface';
import { IFindProductByIdUseCase } from '../../../domain/usecases/find-product-by-id-usecase.interface';
import { IUpdateProductUseCase } from '../../../domain/usecases/update-product-usecase.interface';
import { IDeleteProductUseCase } from '../../../domain/usecases/delete-product-usecase.interface';
import { ProductDTO } from '../dtos/product.dto';
import { BaseProductDto } from '../dtos/base-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let findAllProductsUseCase: jest.Mocked<IFindAllProductsUseCase>;
  let createProductUseCase: jest.Mocked<ICreateProductUseCase>;
  let deleteProductUseCase: jest.Mocked<IDeleteProductUseCase>;
  let findProductByIdUseCase: jest.Mocked<IFindProductByIdUseCase>;
  let updateProductUseCase: jest.Mocked<IUpdateProductUseCase>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: '',
      stock: 0,
    },
    {
      id: '2',
      name: 'Product 2',
      price: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: '',
      stock: 0,
    },
  ];

  beforeEach(async () => {
    findAllProductsUseCase = {
      execute: jest.fn(),
    };
    createProductUseCase = {
      execute: jest.fn(),
    };
    deleteProductUseCase = {
      execute: jest.fn(),
    };
    findProductByIdUseCase = {
      execute: jest.fn(),
    };
    updateProductUseCase = {
      execute: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: CREATE_PRODUCT_USECASE,
          useValue: createProductUseCase,
        },
        {
          provide: FIND_ALL_PRODUCTS_USECASE,
          useValue: findAllProductsUseCase,
        },
        {
          provide: FIND_PRODUCT_BY_ID_USECASE,
          useValue: findProductByIdUseCase,
        },
        {
          provide: UPDATE_PRODUCT_USECASE,
          useValue: updateProductUseCase,
        },
        {
          provide: DELETE_PRODUCT_USECASE,
          useValue: deleteProductUseCase,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of ProductDto', async () => {
      findAllProductsUseCase.execute.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(findAllProductsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(
        mockProducts.map((product) => ProductMapper.mapToDto(product)),
      );
    });

    describe('create', () => {
      it('should create a product and return ProductDto', async () => {
        const createProductDto: BaseProductDto = {
          nombre: 'New Product',
          precio: 150,
          descripcion: 'A new product',
          stock: 10,
        };
        const createdProduct: Product = new Product(
          '1',
          'New Product',
          'A new product',
          150,
          10,
          new Date(),
          new Date(),
        );

        createProductUseCase.execute.mockResolvedValue(createdProduct);

        const result = await controller.create(createProductDto);

        expect(createProductUseCase.execute).toHaveBeenCalledWith(
          ProductMapper.mapDtoToProduct(createProductDto),
        );
        expect(result).toEqual(ProductMapper.mapToDto(createdProduct));
      });
    });

    describe('findOne', () => {
      it('should return a single ProductDto', async () => {
        const productId = '1';
        const product = mockProducts[0];

        findProductByIdUseCase.execute.mockResolvedValue(product);

        const result = await controller.findOne(productId);

        expect(findProductByIdUseCase.execute).toHaveBeenCalledWith(productId);
        expect(result).toEqual(ProductMapper.mapToDto(product));
      });
    });

    describe('update', () => {
      it('should update a product and return ProductDto', async () => {
        const productId = '1';
        const updateProductDto: ProductDTO = {
          id: '1',
          nombre: 'Updated Product',
          precio: 120,
          descripcion: 'Updated description',
          stock: 15,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        };
        const updatedProduct = new Product(
          '1',
          'Updated Product',
          'Updated description',
          120,
          15,
          new Date(),
          new Date(),
        );

        updateProductUseCase.execute.mockResolvedValue(updatedProduct);

        const result = await controller.update(productId, updateProductDto);

        expect(updateProductUseCase.execute).toHaveBeenCalledWith(
          productId,
          ProductMapper.mapDtoToUpdateParams(updateProductDto),
        );
        expect(result).toEqual(ProductMapper.mapToDto(updatedProduct));
      });
    });

    describe('remove', () => {
      it('should delete a product', async () => {
        const productId = '1';

        await controller.remove(productId);

        expect(deleteProductUseCase.execute).toHaveBeenCalledWith(productId);
      });
    });
  });
});
