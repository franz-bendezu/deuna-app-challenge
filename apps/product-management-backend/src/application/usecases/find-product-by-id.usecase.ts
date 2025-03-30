import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { IFindProductByIdUseCase } from '../../domain/usecases/find-product-by-id-usecase.interface';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';

@Injectable()
export class FindProductByIdUseCase implements IFindProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }
}
