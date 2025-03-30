import { EnvironmentConfig } from '../interfaces/env-config.interface';
import { kafkaClientFactory } from './kafka.config';
import { ConfigService } from '@nestjs/config';

describe('kafkaClientFactory', () => {
  let configService: ConfigService<EnvironmentConfig>;

  beforeEach(() => {
    configService = new ConfigService<EnvironmentConfig>();
  });

  it('should throw an error if Kafka configuration is not defined', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => kafkaClientFactory(configService)).toThrowError(
      'Kafka configuration is not defined',
    );
  });

  it('should create a Kafka client', () => {
    const mockKafkaConfig = {
      clientId: 'test-client-id',
      brokers: ['localhost:9092'],
    };

    jest.spyOn(configService, 'get').mockReturnValue(mockKafkaConfig);

    const kafkaClient = kafkaClientFactory(configService);

    expect(kafkaClient).toBeDefined();
  });
});
