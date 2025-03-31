import {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from '../interfaces/product.interface';

export interface IProductService {
  findAll(this: void): Promise<ProductResponse[]>;

  /**
   * Find a product by its ID
   * @param id - The product ID
   * @returns Promise resolving to a single product
   */
  findOne(this: void, id: string): Promise<ProductResponse>;

  /**
   * Create a new product
   * @param createProductDto - Data for creating a product
   * @returns Promise resolving to the created product
   */
  create(
    this: void,
    createProductDto: CreateProductRequest,
  ): Promise<ProductResponse>;

  /**
   * Update an existing product
   * @param id - The product ID to update
   * @param updateProductDto - Data for updating the product
   * @returns Promise resolving to the updated product
   */
  update(
    this: void,
    id: string,
    updateProductDto: UpdateProductRequest,
  ): Promise<ProductResponse>;

  /**
   * Remove a product
   * @param id - The product ID to remove
   * @returns Promise resolving to a boolean indicating success
   */
  remove(this: void, id: string): Promise<boolean>;
}
