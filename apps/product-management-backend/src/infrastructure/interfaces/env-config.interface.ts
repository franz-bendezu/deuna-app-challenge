export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

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
  db: DatabaseConfig;
}
