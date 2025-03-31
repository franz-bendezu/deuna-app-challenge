export interface IBaseSharedProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ISharedProduct extends IBaseSharedProduct {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
