import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { IProductRepository } from '../../../application/repositories/product.repository.interface';
import { BaseProduct } from '../../../domain/models/base-product.model';
import {
  DB_CLIENT,
  DBClient,
} from '../../../infrastructure/config/database.config';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductDatabaseRepository implements IProductRepository {
  constructor(
    @Inject(DB_CLIENT)
    private dbClient: DBClient,
  ) {}

  async create(params: BaseProduct): Promise<Product> {
    const result = await this.dbClient.product.create({
      data: {
        name: params.name,
        description: params.description,
        price: params.price,
        stock: params.stock,
      },
    });
    return ProductMapper.fromRowtoEntity(result);
  }

  async findAll(): Promise<Product[]> {
    const result = await this.dbClient.product.findMany();
    return result.map((row) => ProductMapper.fromRowtoEntity(row));
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.dbClient.product.findUnique({
      where: { id },
    });

    return result ? ProductMapper.fromRowtoEntity(result) : null;
  }

  async updateById(id: string, params: BaseProduct): Promise<Product | null> {
    try {
      const result = await this.dbClient.product.update({
        where: { id },
        data: {
          name: params.name,
          description: params.description,
          price: params.price,
          stock: params.stock,
        },
      });

      return ProductMapper.fromRowtoEntity(result);
    } catch {
      return null;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.dbClient.product.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
