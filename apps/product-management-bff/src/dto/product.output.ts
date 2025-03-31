import { Field, ObjectType } from '@nestjs/graphql';
import { IProductResponse } from '../interfaces/product.interface';

@ObjectType()
export class ProductDTO implements IProductResponse {
  @Field()
  id: string;
  @Field()
  nombre: string;
  @Field()
  descripcion: string;
  @Field()
  precio: number;
  @Field()
  stock: number;
  @Field()
  fechaCreacion: string;
  @Field()
  fechaActualizacion: string;
}
