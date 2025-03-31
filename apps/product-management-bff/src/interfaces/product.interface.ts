export interface IBaseProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface IProductResponse extends IBaseProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductRequest = IBaseProduct;
export type UpdateProductRequest = Partial<IBaseProduct>;
