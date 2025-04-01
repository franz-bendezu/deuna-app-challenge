import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  PRODUCT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { CreateProduct } from '../../domain/models/create-product.model';
import { IUpdateProductUseCase } from '../../domain/usecases/update-product-usecase.interface';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import { IProductPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ProductEvents } from '../../domain/constants/events';

@Injectable()
export class UpdatePartialProductUseCase implements IUpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(PRODUCT_PUBLISHER)
    private readonly eventPublisher: IProductPublisher,
  ) {}

  async execute(id: string, updateProductDto: CreateProduct): Promise<Product> {
    const product = await this.productRepository.updateById(
      id,
      updateProductDto,
    );

    if (!product) {
      throw new ProductNotFoundException(id);
    }
    await this.eventPublisher.publish(ProductEvents.UPDATED, product);
    return product;
  }
}
