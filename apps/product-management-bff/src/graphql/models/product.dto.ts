import { Field, InputType } from '@nestjs/graphql';
import { IsDecimal, IsInt } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  @IsDecimal()
  price: number;
  @Field()
  @IsInt()
  stock: number;
}

@InputType()
export class UpdateProductInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  @IsDecimal()
  price: number;
  @Field()
  @IsInt()
  stock: number;
}
