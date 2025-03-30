export interface IBaseProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface IProduct extends IBaseProduct {
  id: string;
}

export interface CreateProductDto extends IBaseProduct {}
export interface UpdateProductDto extends Partial<IBaseProduct> {}
