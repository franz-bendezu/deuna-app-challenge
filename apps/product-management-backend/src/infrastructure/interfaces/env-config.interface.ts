export interface CacheConfiguration {
  url: string;
  ttl: number;
  lruSize: number;
}

export interface KafkaConfiguration {
  brokers: string[];
  clientId: string;
}

export interface EnvironmentConfig {
  redis: CacheConfiguration;

  kafka: KafkaConfiguration;

  port: number;
}
