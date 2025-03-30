import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  EVENT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { IDeleteProductUseCase } from '../../domain/usecases/delete-product-usecase.interface';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ProductEvents } from '../../domain/constants/events';

@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
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

    await this.eventPublisher.publish(ProductEvents.DELETED, {
      id,
      deletedAt: new Date(),
    });
  }
}
