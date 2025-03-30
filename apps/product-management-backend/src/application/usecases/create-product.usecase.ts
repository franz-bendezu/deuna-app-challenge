import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  EVENT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { BaseProduct } from '../../domain/models/base-product.model';
import { ICreateProductUseCase } from '../../domain/usecases/create-product-usecase.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ProductEvents } from '../../domain/constants/events';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(createProductDto: BaseProduct): Promise<Product> {
    const product = await this.productRepository.create(createProductDto);
    await this.eventPublisher.publish(ProductEvents.CREATED, product);
    return product;
  }
}
