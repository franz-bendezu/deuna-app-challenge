import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import { BaseProduct } from '../../domain/models/base-product.model';
import { ICreateProductUseCase } from '../../domain/usecases/create-product-usecase.interface';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(createProductDto: BaseProduct): Promise<Product> {
    const product = await this.productRepository.create(createProductDto);
    return product;
  }
}
