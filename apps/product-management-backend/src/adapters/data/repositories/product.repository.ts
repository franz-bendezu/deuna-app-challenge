import { Product } from '../../../domain/models/product.model';
import { BaseProduct } from '../../../domain/models/base-product.model';
import { IProductRepository } from '../../../application/repositories/product.repository.interface';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_CACHE_REPOSITORY,
  PRODUCT_DB_REPOSITORY,
} from '../../data/constants/injection-tokens.constant';

export class ProductRepository implements IProductRepository {
  constructor(
    @Inject(PRODUCT_DB_REPOSITORY)
    private readonly productDatabaseRepository: IProductRepository,
    @Inject(PRODUCT_CACHE_REPOSITORY)
    private readonly productCacheRepository: IProductRepository,
  ) {}

  async create(params: BaseProduct): Promise<Product> {
    const product = await this.productDatabaseRepository.create(params);
    await this.productCacheRepository.create(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    const cachedProducts = await this.productCacheRepository.findAll();
    if (cachedProducts.length > 0) {
      return cachedProducts;
    }
    const products = await this.productDatabaseRepository.findAll();
    await Promise.all(
      products.map((product) => this.productCacheRepository.create(product)),
    );
    return products;
  }

  async findById(id: string): Promise<Product | null> {
    const cachedProduct = await this.productCacheRepository.findById(id);
    if (cachedProduct) {
      return cachedProduct;
    }
    const product = await this.productDatabaseRepository.findById(id);
    if (product) {
      await this.productCacheRepository.create(product);
    }
    return product;
  }

  async updateById(id: string, params: BaseProduct): Promise<Product | null> {
    const product = await this.productDatabaseRepository.updateById(id, params);
    if (product) {
      await this.productCacheRepository.updateById(id, product);
    }
    return product;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.productDatabaseRepository.deleteById(id);
    if (result) {
      await this.productCacheRepository.deleteById(id);
    }
    return result;
  }
}
