import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductDTO {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;

  @Field()
  descripcion: string;

  @Field(() => Float)
  precio: number;

  @Field(() => Int)
  stock: number;

  @Field()
  fechaCreacion: string;

  @Field()
  fechaActualizacion: string;
}
