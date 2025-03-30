import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { BaseProduct } from '../../domain/models/base-product.model';
import { IUpdateProductUseCase } from '../../domain/usecases/update-product-usecase.interface';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';

@Injectable()
export class UpdateProductUseCase implements IUpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, updateProductDto: BaseProduct): Promise<Product> {
    const product = await this.productRepository.updateById(
      id,
      updateProductDto,
    );

    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }
}
