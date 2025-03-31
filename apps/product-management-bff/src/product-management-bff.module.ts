import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProductService } from './services/product.service';
import { ProductResolver } from './graphql/resolvers/product.resolver';
import configuration from './config/configuration';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    HttpModule,
  ],
  providers: [
    // Service Layer
    ProductService,
    // Data Access Layer
    ProductService,
    // Resolver Layer (GraphQL)
    ProductResolver,
  ],
})
export class ProductManagementBffModule {}
