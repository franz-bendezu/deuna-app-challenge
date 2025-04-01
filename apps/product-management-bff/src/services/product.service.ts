import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../exceptions/api-error.exception';
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
} from '../interfaces/product.interface';
import { IProductService } from './product.service.interface';

@Injectable()
export class ProductService implements IProductService {
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

  async findAll(): Promise<IProductResponse[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IProductResponse[]>(this.API_URL),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, 'Failed to fetch products', 500);
    }
  }

  async findOne(id: string): Promise<IProductResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IProductResponse>(`${this.API_URL}/${id}`),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, `Failed to fetch product with id ${id}`, 500);
    }
  }

  async create(
    createProductDto: ICreateProductRequest,
  ): Promise<IProductResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<IProductResponse>(this.API_URL, createProductDto),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, 'Failed to create product', 500);
    }
  }

  async update(
    id: string,
    updateProductDto: IUpdateProductRequest,
  ): Promise<IProductResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch<IProductResponse>(
          `${this.API_URL}/${id}`,
          updateProductDto,
        ),
      );
      return data;
    } catch (error) {
      throw new ApiError(error, `Failed to update product with id ${id}`, 500);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpService.delete(`${this.API_URL}/${id}`));
      return true;
    } catch (error) {
      throw new ApiError(error, `Failed to delete product with id ${id}`, 500);
    }
  }
}
