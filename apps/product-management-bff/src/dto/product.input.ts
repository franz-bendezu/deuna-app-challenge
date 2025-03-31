import { Field, InputType } from '@nestjs/graphql';
import {
  ICreateProductRequest,
  IUpdateProductRequest,
} from '../interfaces/product.interface';

@InputType()
export class CreateProductInput implements ICreateProductRequest {
  @Field()
  nombre: string;

  @Field()
  descripcion: string;

  @Field()
  precio: number;

  @Field()
  stock: number;
}

@InputType()
export class UpdateProductInput implements IUpdateProductRequest {
  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  precio?: number;

  @Field({ nullable: true })
  stock?: number;
}
