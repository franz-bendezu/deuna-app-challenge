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
import { ProductDTO } from '../dtos/product.dto';
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

@ApiTags('productos')
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
    summary: 'Crear producto',
    description: 'Registra un nuevo producto en el catálogo del sistema.',
  })
  @ApiCreatedResponse({
    description: 'Producto creado exitosamente',
    type: ProductDTO,
  })
  async create(@Body() createProductDto: BaseProductDto): Promise<ProductDTO> {
    const productParams = ProductMapper.mapDtoToProduct(createProductDto);
    const createdProduct =
      await this.createProductUseCase.execute(productParams);
    return ProductMapper.mapToDto(createdProduct);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar productos',
    description: 'Obtiene el catálogo completo de productos disponibles.',
  })
  @ApiOkResponse({
    description: 'Catálogo de productos',
    type: ProductDTO,
    isArray: true,
  })
  async findAll(): Promise<ProductDTO[]> {
    const products = await this.findAllProductsUseCase.execute();
    return products.map((product) => ProductMapper.mapToDto(product));
  }

  @Get(ProductsController.PATH_ID)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Consultar producto',
    description:
      'Busca y devuelve la información de un producto específico mediante su ID.',
  })
  @ApiOkResponse({
    description: 'Información detallada del producto',
    type: ProductDTO,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el producto solicitado',
  })
  async findOne(
    @Param(ProductsController.PATH_ID_PARAM) id: string,
  ): Promise<ProductDTO> {
    const product = await this.findProductByIdUseCase.execute(id);
    return ProductMapper.mapToDto(product);
  }

  @Put(ProductsController.PATH_ID)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Modificar producto',
    description:
      'Actualiza la información de un producto existente en el catálogo.',
  })
  @ApiOkResponse({
    description: 'Información actualizada del producto',
    type: ProductDTO,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el producto a actualizar',
  })
  async update(
    @Param(ProductsController.PATH_ID_PARAM) id: string,
    @Body() updateProductDto: ProductDTO,
  ) {
    const params = ProductMapper.mapDtoToUpdateParams(updateProductDto);
    const updatedProduct = await this.updateProductUseCase.execute(id, params);
    return ProductMapper.mapToDto(updatedProduct);
  }

  @Delete(ProductsController.PATH_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar producto',
    description: 'Elimina permanentemente un producto del catálogo.',
  })
  @ApiNoContentResponse({
    description: 'Producto eliminado correctamente',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el producto a eliminar',
  })
  async remove(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
  }
}
