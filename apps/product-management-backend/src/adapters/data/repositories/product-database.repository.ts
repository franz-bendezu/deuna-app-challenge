import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { IProductRepository } from '../../../application/repositories/product-repository.interface';
import { IProductRow } from '../interfaces/product-row.interface';
import { BaseProduct } from '../../../domain/models/base-product.model';
import {
  DATABASE_POOL,
  DatabasePool,
} from '../../../infrastructure/config/database.config';
import { ProductMapper } from '../mappers/product.mapper';
import {
  QUERY_CREATE_PRODUCT,
  QUERY_DELETE_PRODUCT,
  QUERY_FIND_ALL_PRODUCTS,
  QUERY_FIND_PRODUCT_BY_ID,
  QUERY_UPDATE_PRODUCT,
} from './query/product.queries';
import { QueryResult } from 'pg';

@Injectable()
export class ProductDatabaseRepository implements IProductRepository {
  constructor(
    @Inject(DATABASE_POOL)
    private pool: DatabasePool,
  ) {}

  async create(params: BaseProduct): Promise<Product> {
    const result: QueryResult<IProductRow> = await this.pool.query<IProductRow>(
      QUERY_CREATE_PRODUCT,
      [params.name, params.description, params.price, params.stock],
    );
    return ProductMapper.fromRowtoEntity(result.rows[0]);
  }

  async findAll(): Promise<Product[]> {
    const result = await this.pool.query<IProductRow>(QUERY_FIND_ALL_PRODUCTS);
    return result.rows.map((row) => ProductMapper.fromRowtoEntity(row));
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.pool.query<IProductRow>(
      QUERY_FIND_PRODUCT_BY_ID,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return ProductMapper.fromRowtoEntity(result.rows[0]);
  }

  async updateById(id: string, params: BaseProduct): Promise<Product | null> {
    const result = await this.pool.query<IProductRow>(QUERY_UPDATE_PRODUCT, [
      params.name,
      params.description,
      params.price,
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return ProductMapper.fromRowtoEntity(result.rows[0]);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.pool.query(QUERY_DELETE_PRODUCT, [id]);
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  }
}
