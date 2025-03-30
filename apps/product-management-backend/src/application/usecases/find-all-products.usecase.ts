import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { IFindAllProductsUseCase } from '../../domain/usecases/find-all-products-usecase.interface';

@Injectable()
export class FindAllProductsUseCase implements IFindAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products;
  }
}
