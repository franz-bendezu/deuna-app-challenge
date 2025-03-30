import { Injectable, Logger } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { IEventPublisher } from '../../../domain/interfaces/event-publisher.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KafkaEventPublisherAdapter implements IEventPublisher {
  private readonly logger = new Logger(KafkaEventPublisherAdapter.name);

  constructor(private readonly kafkaClient: ClientKafkaProxy) {}

  async publish<T>(topic: string, message: T): Promise<void> {
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
