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

@Controller('products')
export class ProductsController {
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
  async create(@Body() createProductDto: BaseProductDto): Promise<ProductDto> {
    const productParams = ProductMapper.mapDtoToProduct(createProductDto);
    const createdProduct =
      await this.createProductUseCase.execute(productParams);
    return ProductMapper.mapToDto(createdProduct);
  }

  @Get()
  async findAll(): Promise<ProductDto[]> {
    const products = await this.findAllProductsUseCase.execute();
    return products.map((product) => ProductMapper.mapToDto(product));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.findProductByIdUseCase.execute(id);
    return ProductMapper.mapToDto(product);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: ProductDto) {
    const params = ProductMapper.mapDtoToUpdateParams(updateProductDto);
    const updatedProduct = await this.updateProductUseCase.execute(id, params);
    return ProductMapper.mapToDto(updatedProduct);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
  }
}
