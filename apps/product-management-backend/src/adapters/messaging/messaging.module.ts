import { Module } from '@nestjs/common';
import { KafkaEventPublisherAdapter } from './publisher/kafka-event.publisher';
import { EVENT_PUBLISHER } from '../../domain/constants/injection-tokens';

@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useClass: KafkaEventPublisherAdapter,
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class AdaptersMessagingModule {}
