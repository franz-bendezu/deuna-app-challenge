import {
  ClientProxyFactory,
  Transport,
  ClientKafkaProxy,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentConfig,
  KafkaConfiguration,
} from '../interfaces/env-config.interface';
import { InjectionToken } from '@nestjs/common';

export const KAFKA_CLIENT: InjectionToken<ClientKafkaProxy> = 'KAFKA_CLIENT';

export const kafkaClientFactory = (
  configService: ConfigService<EnvironmentConfig>,
): ClientKafkaProxy => {
  const kafkaConfig = configService.get<KafkaConfiguration>('kafka');

  if (!kafkaConfig) {
    throw new Error('Kafka configuration is not defined');
  }

  return ClientProxyFactory.create({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  });
};
