import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from '../../services/product.service';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query('products')
  async getProducts() {
    return this.productService.findAll();
  }

  @Query('product')
  async getProduct(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Mutation('createProduct')
  async createProduct(@Args('input') input: any) {
    return this.productService.create(input);
  }

  @Mutation('updateProduct')
  async updateProduct(@Args('id') id: string, @Args('input') input: any) {
    return this.productService.update(id, input);
  }

  @Mutation('deleteProduct')
  async deleteProduct(@Args('id') id: string) {
    return this.productService.remove(id);
  }
}
