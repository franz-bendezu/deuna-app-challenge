import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BaseProductDto } from '../dtos/base-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { ICreateProductUseCase } from '../../../domain/usecases/create-product-usecase.interface';
import { IDeleteProductUseCase } from '../../../domain/usecases/delete-product-usecase.interface';
import { IFindAllProductsUseCase } from '../../../domain/usecases/find-all-products-usecase.interface';
import { IFindProductByIdUseCase } from '../../../domain/usecases/find-product-by-id-usecase.interface';
import { IUpdateProductUseCase } from '../../../domain/usecases/update-product-usecase.interface';
import {
  CREATE_PRODUCT_USECASE,
  DELETE_PRODUCT_USECASE,
  FIND_ALL_PRODUCTS_USECASE,
  FIND_PRODUCT_BY_ID_USECASE,
  UPDATE_PRODUCT_USECASE,
} from '../../../domain/constants/injection-tokens';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller(ProductsController.PATH)
export class ProductsController {
  static readonly PATH = 'products';
  static readonly PATH_ID_PARAM = 'id';
  static readonly PATH_ID = `:${ProductsController.PATH_ID_PARAM}`;
  constructor(
    @Inject(CREATE_PRODUCT_USECASE)
    private readonly createProductUseCase: ICreateProductUseCase,
    @Inject(FIND_ALL_PRODUCTS_USECASE)
    private readonly findAllProductsUseCase: IFindAllProductsUseCase,
    @Inject(FIND_PRODUCT_BY_ID_USECASE)
    private readonly findProductByIdUseCase: IFindProductByIdUseCase,
    @Inject(UPDATE_PRODUCT_USECASE)
    private readonly updateProductUseCase: IUpdateProductUseCase,
    @Inject(DELETE_PRODUCT_USECASE)
    private readonly deleteProductUseCase: IDeleteProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product in the system.',
  })
  @ApiCreatedResponse({
    description: 'The created product',
    type: ProductDto,
  })
  async create(@Body() createProductDto: BaseProductDto): Promise<ProductDto> {
    const productParams = ProductMapper.mapDtoToProduct(createProductDto);
    const createdProduct =
      await this.createProductUseCase.execute(productParams);
    return ProductMapper.mapToDto(createdProduct);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves all products from the system.',
  })
  @ApiOkResponse({
    description: 'List of products',
    type: ProductDto,
    isArray: true,
  })
  async findAll(): Promise<ProductDto[]> {
    const products = await this.findAllProductsUseCase.execute();
    return products.map((product) => ProductMapper.mapToDto(product));
  }

  @Get(ProductsController.PATH_ID)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Retrieves a product by its ID from the system.',
  })
  @ApiOkResponse({
    description: 'The product with the specified ID',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async findOne(@Param('id') id: string) {
    const product = await this.findProductByIdUseCase.execute(id);
    return ProductMapper.mapToDto(product);
  }

  @Put(ProductsController.PATH_ID)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a product',
    description: 'Updates an existing product in the system.',
  })
  @ApiOkResponse({
    description: 'The updated product',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async update(@Param('id') id: string, @Body() updateProductDto: ProductDto) {
    const params = ProductMapper.mapDtoToUpdateParams(updateProductDto);
    const updatedProduct = await this.updateProductUseCase.execute(id, params);
    return ProductMapper.mapToDto(updatedProduct);
  }

  @Delete(ProductsController.PATH_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes a product from the system.',
  })
  @ApiNoContentResponse({
    description: 'Product deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async remove(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
  }
}
