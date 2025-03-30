import { Module } from '@nestjs/common';
import { ProductManagementBffController } from './product-management-bff.controller';
import { ProductManagementBffService } from './product-management-bff.service';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['**/*.graphql'],
    }),
  ],
  controllers: [ProductManagementBffController],
  providers: [ProductManagementBffService],
})
export class ProductManagementBffModule {}
