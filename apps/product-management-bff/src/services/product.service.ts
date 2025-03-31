import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../exceptions/api-error.exception';
import {
  IProduct,
  CreateProductRequest,
  UpdateProductRequest,
} from '../interfaces/product.interface';

@Injectable()
export class ProductService {
  private readonly API_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const backendUrl = this.configService.get<string>('backend.url');
    const productsEndpoint = this.configService.get<string>(
      'backend.productsEndpoint',
    );
    this.API_URL = `${backendUrl}${productsEndpoint}`;
  }

  async findAll(): Promise<IProduct[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IProduct[]>(this.API_URL),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, 'Failed to fetch products', 500);
    }
  }

  async findOne(id: string): Promise<IProduct> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IProduct>(`${this.API_URL}/${id}`),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, 'Product not found', 404);
    }
  }

  async create(createProductDto: CreateProductRequest): Promise<IProduct> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<IProduct>(this.API_URL, createProductDto),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, 'Failed to create product', 400);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductRequest,
  ): Promise<IProduct> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.put<IProduct>(
          `${this.API_URL}/${id}`,
          updateProductDto,
        ),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, 'Failed to update product', 400);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpService.delete(`${this.API_URL}/${id}`));
      return true;
    } catch (error) {
      throw new ApiError(error, 'Failed to delete product', 400);
    }
  }
}
