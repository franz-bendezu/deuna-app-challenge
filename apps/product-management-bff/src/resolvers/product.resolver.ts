import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from '../services/product.service';
import { ProductDTO } from '../dto/product.output';
import { CreateProductInput, UpdateProductInput } from '../dto/product.input';

@Resolver(() => ProductDTO)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductDTO], { name: 'productos' })
  async getProducts(): Promise<ProductDTO[]> {
    return this.productService.findAll();
  }

  @Query(() => ProductDTO, { name: 'producto' })
  async getProduct(@Args('id') id: string): Promise<ProductDTO> {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductDTO, { name: 'crearProducto' })
  async createProduct(
    @Args('input') createProductInput: CreateProductInput,
  ): Promise<ProductDTO> {
    return this.productService.create(createProductInput);
  }

  @Mutation(() => ProductDTO, { name: 'actualizarProducto' })
  async updateProduct(
    @Args('id') id: string,
    @Args('input') updateProductInput: UpdateProductInput,
  ): Promise<ProductDTO> {
    return this.productService.update(id, updateProductInput);
  }

  @Mutation(() => Boolean, { name: 'eliminarProducto' })
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productService.remove(id);
  }
}
