export interface CacheConfiguration {
  url: string;
  ttl: number;
  lruSize: number;
}

export interface KafkaConfiguration {
  brokers: string[];
  clientId: string;
}

interface AppConfiguration {
  port: number;
  environment: string;
}

export interface EnvironmentConfig {
  redis: CacheConfiguration;

  kafka: KafkaConfiguration;

  app: AppConfiguration;
}
