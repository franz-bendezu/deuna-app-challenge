import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductDTO {
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
}
