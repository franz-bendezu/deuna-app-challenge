import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  EVENT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { BaseProduct } from '../../domain/models/base-product.model';
import { IUpdateProductUseCase } from '../../domain/usecases/update-product-usecase.interface';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ProductEvents } from '../../domain/constants/events';

@Injectable()
export class UpdateProductUseCase implements IUpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(id: string, updateProductDto: BaseProduct): Promise<Product> {
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
