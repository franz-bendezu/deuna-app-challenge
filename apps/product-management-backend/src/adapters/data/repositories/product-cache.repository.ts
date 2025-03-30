import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { IProductRepository } from '../../../application/repositories/product.repository.interface';
import { RedisCache } from '../../../infrastructure/config/cache.config';
@Injectable()
export class ProductCacheRepository implements IProductRepository {
  private readonly PRODUCTS_CACHE_KEY = 'products';
  private readonly PRODUCT_CACHE_PREFIX = 'product:';
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds

  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  private generateProductCacheKey(id: Product['id']): string {
    return `${this.PRODUCT_CACHE_PREFIX}${id}`;
  }

  private async getCachedProducts() {
    const products = await this.cacheManager.get<Product[]>(
      this.PRODUCTS_CACHE_KEY,
    );
    return products ?? [];
  }

  private async saveProductInCache(product: Product): Promise<void> {
    const products = await this.getCachedProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    await this.cacheManager.set<Product[]>(
      this.PRODUCTS_CACHE_KEY,
      products,
      this.DEFAULT_TTL,
    );
  }

  private async removeProductFromCache(productId: string): Promise<void> {
    const products = await this.getCachedProducts();
    const updatedProducts = products.filter((p) => p.id !== productId);
    await this.cacheManager.set<Product[]>(
      this.PRODUCTS_CACHE_KEY,
      updatedProducts,
      this.DEFAULT_TTL,
    );
  }

  async create(params: Product): Promise<Product> {
    await this.cacheManager.set<Product>(
      this.generateProductCacheKey(params.id),
      params,
      this.DEFAULT_TTL,
    );
    await this.saveProductInCache(params);

    return params;
  }

  async findAll(): Promise<Product[]> {
    const cachedProducts = await this.cacheManager.get<Product[]>(
      this.PRODUCTS_CACHE_KEY,
    );
    if (cachedProducts) {
      return cachedProducts;
    }
    return [];
  }

  async findById(id: string): Promise<Product | null> {
    const cachedProduct = await this.cacheManager.get<Product>(
      this.generateProductCacheKey(id),
    );
    if (cachedProduct) {
      return cachedProduct;
    }
    return null;
  }

  async updateById(id: string, params: Product): Promise<Product | null> {
    const cachedProduct = await this.cacheManager.get<Product>(
      this.generateProductCacheKey(id),
    );
    if (cachedProduct) {
      const updatedProduct = { ...cachedProduct, ...params };
      await this.cacheManager.set(
        this.generateProductCacheKey(id),
        updatedProduct,
        this.DEFAULT_TTL,
      );
      await this.saveProductInCache(updatedProduct);
      return updatedProduct;
    }
    return null;
  }

  async deleteById(id: string): Promise<boolean> {
    const cachedProduct = await this.cacheManager.get<Product>(
      this.generateProductCacheKey(id),
    );
    if (cachedProduct) {
      await this.cacheManager.del(this.generateProductCacheKey(id));
      await this.removeProductFromCache(id);
      return true;
    }
    return false;
  }
}
