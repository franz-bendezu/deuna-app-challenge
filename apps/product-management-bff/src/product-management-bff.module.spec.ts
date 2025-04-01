import { Test } from '@nestjs/testing';
import { ProductManagementBffModule } from './product-management-bff.module';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductService } from './services/product.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { HttpModule } from '@nestjs/axios';

describe('ProductManagementBffModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide ProductResolver', async () => {
    const module = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    }).compile();

    const resolver = module.get<ProductResolver>(ProductResolver);
    expect(resolver).toBeDefined();
  });

  it('should provide ProductService', async () => {
    const module = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    }).compile();

    const service = module.get<ProductService>(ProductService);
    expect(service).toBeDefined();
  });

  it('should import ConfigModule', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    }).compile();

    const configModule = moduleRef.get<ConfigModule>(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should import HttpModule', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    }).compile();

    const httpModule = moduleRef.get<HttpModule>(HttpModule);
    expect(httpModule).toBeDefined();
  });

  it('should import GraphQLModule', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    }).compile();

    const gqlModule = moduleRef.get<GraphQLModule>(GraphQLModule);
    expect(gqlModule).toBeDefined();
  });
});
