import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  nombre: string;

  @Field()
  descripcion: string;

  @Field(() => Float)
  precio: number;

  @Field(() => Int)
  stock: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Float, { nullable: true })
  precio?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;
}
