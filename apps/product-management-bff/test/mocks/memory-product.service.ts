import { HttpStatus } from '@nestjs/common';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../../src/dto/product.input';
import { ProductDTO } from '../../src/dto/product.output';
import { ApiError } from '../../src/exceptions/api-error.exception';
import { IProductService } from '../../src/services/product.service.interface';
import { randomUUID } from 'crypto';

export class MemoryProductService implements IProductService {
  private products: ProductDTO[] = [
    {
      id: randomUUID(),
      nombre: 'Product 1',
      descripcion: 'Description 1',
      precio: 100,
      stock: 10,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      nombre: 'Product 2',
      descripcion: 'Description 2',
      precio: 200,
      stock: 20,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      nombre: 'Product 3',
      descripcion: 'Description 3',
      precio: 300,
      stock: 30,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    },
  ];

  findAll(): Promise<ProductDTO[]> {
    return Promise.resolve([...this.products]);
  }

  findOne(id: string): Promise<ProductDTO> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new ApiError(
        new Error('Product not found'),
        'Product not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return Promise.resolve({ ...product });
  }

  create(input: CreateProductInput): Promise<ProductDTO> {
    const newProduct: ProductDTO = {
      id: randomUUID(),
      ...input,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
    this.products.push(newProduct);
    return Promise.resolve({ ...newProduct });
  }

  update(id: string, input: UpdateProductInput): Promise<ProductDTO> {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new ApiError(
        new Error('Product not found'),
        'Product not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedProduct: ProductDTO = {
      ...this.products[productIndex],
      ...input,
      fechaActualizacion: new Date().toISOString(),
    };

    this.products[productIndex] = updatedProduct;
    return Promise.resolve({ ...updatedProduct });
  }

  remove(id: string): Promise<boolean> {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new ApiError(
        new Error('Product not found'),
        'Product not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.products.splice(productIndex, 1);
    return Promise.resolve(true);
  }
}
