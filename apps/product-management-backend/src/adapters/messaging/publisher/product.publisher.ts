import { Injectable, Logger } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { IProductPublisher } from '../../../domain/interfaces/event-publisher.interface';
import { firstValueFrom } from 'rxjs';
import { Product } from 'apps/product-management-backend/src/domain/models/product.model';
import { ProductEvents } from 'apps/product-management-backend/src/domain/constants/events';

@Injectable()
export class ProductPublisher implements IProductPublisher {
  private readonly logger = new Logger(ProductPublisher.name);

  constructor(private readonly kafkaClient: ClientKafkaProxy) {}

  async publish(topic: ProductEvents, message: Product): Promise<void> {
    try {
      await firstValueFrom(this.kafkaClient.emit(topic, message));
      this.logger.log(
        `Message published to topic ${topic}: ${JSON.stringify(message)}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish message to topic ${topic}: ${error}`,
        error,
      );
    }
  }
}
