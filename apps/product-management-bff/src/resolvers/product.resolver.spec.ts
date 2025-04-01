import { Test, TestingModule } from '@nestjs/testing';
import { ProductResolver } from './product.resolver';
import { ProductService } from '../services/product.service';
import { ProductDTO } from '../dto/product.output';
import { NotFoundException } from '@nestjs/common';
import { CreateProductInput, UpdateProductInput } from '../dto/product.input';
import { IProductService } from '../services/product.service.interface';

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let productService: jest.Mocked<IProductService>;

  const mockProductDTO: ProductDTO = {
    id: '1',
    nombre: 'Test Product',
    descripcion: 'Test Description',
    precio: 99.99,
    stock: 50,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  beforeEach(async () => {
    const mockProductService: jest.Mocked<IProductService> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductResolver,
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    resolver = module.get<ProductResolver>(ProductResolver);
    productService = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('products', () => {
    it('should return an array of products', async () => {
      const products = [mockProductDTO];
      productService.findAll.mockResolvedValue(products);

      const result = await resolver.getProducts();
      expect(result).toEqual(products);
      expect(productService.findAll).toHaveBeenCalled();
    });
  });

  describe('product', () => {
    it('should return a single product by id', async () => {
      productService.findOne.mockResolvedValue(mockProductDTO);

      const result = await resolver.getProduct('1');
      expect(result).toEqual(mockProductDTO);
      expect(productService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      productService.findOne.mockRejectedValue(new NotFoundException());

      await expect(resolver.getProduct('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(productService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const input: CreateProductInput = {
        nombre: 'New Product',
        descripcion: 'New Description',
        precio: 149.99,
        stock: 100,
      };

      productService.create.mockResolvedValue(mockProductDTO);

      const result = await resolver.createProduct(input);
      expect(result).toEqual(mockProductDTO);
      expect(productService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const input: UpdateProductInput = {
        nombre: 'Updated Product',
        precio: 199.99,
      };

      productService.update.mockResolvedValue({
        ...mockProductDTO,
        nombre: 'Updated Product',
        precio: 199.99,
      });

      const result = await resolver.updateProduct('1', input);
      expect(result.nombre).toEqual('Updated Product');
      expect(result.precio).toEqual(199.99);
      expect(productService.update).toHaveBeenCalledWith('1', input);
    });

    it('should throw NotFoundException when product not found', async () => {
      const input: UpdateProductInput = {
        nombre: 'Updated Product',
      };

      productService.update.mockRejectedValue(new NotFoundException());

      await expect(resolver.updateProduct('999', input)).rejects.toThrow(
        NotFoundException,
      );
      expect(productService.update).toHaveBeenCalledWith('999', input);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return true', async () => {
      productService.remove.mockResolvedValue(true);

      const result = await resolver.deleteProduct('1');
      expect(result).toBe(true);
      expect(productService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      productService.remove.mockRejectedValue(new NotFoundException());

      await expect(resolver.deleteProduct('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(productService.remove).toHaveBeenCalledWith('999');
    });
  });
});
