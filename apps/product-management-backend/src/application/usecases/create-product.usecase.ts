import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../repositories/product.repository.interface';
import {
  PRODUCT_PUBLISHER,
  PRODUCT_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { CreateProduct } from '../../domain/models/create-product.model';
import { ICreateProductUseCase } from '../../domain/usecases/create-product-usecase.interface';
import { IProductPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ProductEvents } from '../../domain/constants/events';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(PRODUCT_PUBLISHER)
    private readonly eventPublisher: IProductPublisher,
  ) {}

  async execute(createProductDto: CreateProduct): Promise<Product> {
    const product = await this.productRepository.create(createProductDto);
    await this.eventPublisher.publish(ProductEvents.CREATED, product);
    return product;
  }
}
