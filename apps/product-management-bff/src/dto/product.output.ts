import { Field, ObjectType } from '@nestjs/graphql';
import { IProductResponse } from '../interfaces/product.interface';

@ObjectType()
export class ProductDTO implements IProductResponse {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  price: number;
  @Field()
  stock: number;
  @Field()
  createdAt: string;
  @Field()
  updatedAt: string;
}
