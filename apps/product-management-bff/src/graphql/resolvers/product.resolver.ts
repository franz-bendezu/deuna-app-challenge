import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from '../../services/product.service';
import { ProductDTO } from '../models/product.models';
import { CreateProductInput, UpdateProductInput } from '../models/product.dto';

@Resolver(() => ProductDTO)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductDTO], { name: 'products' })
  async getProducts(): Promise<ProductDTO[]> {
    return this.productService.findAll();
  }

  @Query(() => ProductDTO, { name: 'product' })
  async getProduct(@Args('id') id: string): Promise<ProductDTO> {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductDTO, { name: 'createProduct' })
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductDTO> {
    return this.productService.create(input);
  }

  @Mutation(() => ProductDTO, { name: 'updateProduct' })
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductDTO> {
    return this.productService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteProduct' })
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productService.remove(id);
  }
}
