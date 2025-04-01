import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { ProductService } from './product.service';
import { ApiError } from '../exceptions/api-error.exception';
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
} from '../interfaces/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'backend.url') return 'http://mock-backend.com';
      if (key === 'backend.productsEndpoint') return '/products';
      return null;
    }),
  };

  const mockProduct: IProductResponse = {
    id: '1',
    nombre: 'Test Product',
    precio: 100,
    descripcion: 'Test Description',
    stock: 12,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const response: AxiosResponse<IProductResponse[]> = {
        data: [mockProduct],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };
      const spyGet = jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(response));

      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
      expect(spyGet).toHaveBeenCalledWith('http://mock-backend.com/products');
    });

    it('should throw an ApiError if the request fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('Request failed')));

      await expect(service.findAll()).rejects.toThrow(ApiError);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const response: AxiosResponse<IProductResponse> = {
        data: mockProduct,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };
      const spyGet = jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(response));

      const result = await service.findOne('1');
      expect(result).toEqual(mockProduct);
      expect(spyGet).toHaveBeenCalledWith('http://mock-backend.com/products/1');
    });

    it('should throw an ApiError if the product is not found', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('Not found')));

      await expect(service.findOne('1')).rejects.toThrow(ApiError);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: ICreateProductRequest = {
        nombre: 'New Product',
        precio: 200,
        descripcion: 'New Description',
        stock: 0,
      };
      const response: AxiosResponse<IProductResponse> = {
        data: mockProduct,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };
      const spyPost = jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of(response));

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(spyPost).toHaveBeenCalledWith(
        'http://mock-backend.com/products',
        createProductDto,
      );
    });

    it('should throw an ApiError if creation fails', async () => {
      const spyPost = jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error('Creation failed')));

      await expect(
        service.create({
          nombre: '',
          precio: 0,
          descripcion: '',
          stock: 0,
        }),
      ).rejects.toThrow(ApiError);
      const expected: ICreateProductRequest = {
        nombre: '',
        precio: 0,
        descripcion: '',
        stock: 0,
      };
      expect(spyPost).toHaveBeenCalledWith(
        'http://mock-backend.com/products',
        expected,
      );
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateProductDto: IUpdateProductRequest = {
        nombre: 'Updated Product',
        precio: 300,
        descripcion: 'Updated Description',
      };
      const response: AxiosResponse<IProductResponse> = {
        data: mockProduct,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };
      const spyPut = jest
        .spyOn(httpService, 'patch')
        .mockReturnValue(of(response));

      const result = await service.update('1', updateProductDto);
      expect(result).toEqual(mockProduct);
      expect(spyPut).toHaveBeenCalledWith(
        'http://mock-backend.com/products/1',
        updateProductDto,
      );
    });

    it('should throw an ApiError if update fails', async () => {
      jest
        .spyOn(httpService, 'patch')
        .mockReturnValue(throwError(() => new Error('Update failed')));

      await expect(
        service.update('1', { nombre: '', precio: 0, descripcion: '' }),
      ).rejects.toThrow(ApiError);
    });
  });

  describe('remove', () => {
    it('should delete a product and return true', async () => {
      const spyDelete = jest
        .spyOn(httpService, 'delete')
        .mockReturnValue(of({} as AxiosResponse));

      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(spyDelete).toHaveBeenCalledWith(
        'http://mock-backend.com/products/1',
      );
    });

    it('should throw an ApiError if deletion fails', async () => {
      const spyDelete = jest
        .spyOn(httpService, 'delete')
        .mockReturnValue(throwError(() => new Error('Deletion failed')));

      await expect(service.remove('1')).rejects.toThrow(ApiError);

      expect(spyDelete).toHaveBeenCalledWith(
        'http://mock-backend.com/products/1',
      );
    });
  });
});
