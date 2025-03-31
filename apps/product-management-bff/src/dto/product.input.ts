import { Field, InputType } from '@nestjs/graphql';
import {
  ICreateProductRequest,
  IUpdateProductRequest,
} from '../interfaces/product.interface';

@InputType()
export class CreateProductInput implements ICreateProductRequest {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  stock: number;
}

@InputType()
export class UpdateProductInput implements IUpdateProductRequest {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  stock?: number;
}
