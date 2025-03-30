import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { IDeleteProductUseCase } from '../../domain/usecases/delete-product-usecase.interface';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';

@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    const deleted = await this.productRepository.deleteById(id);

    if (!deleted) {
      throw new ProductNotFoundException(id);
    }
  }
}
