import { IBaseSharedProduct, ISharedProduct } from '@app/shared';

export interface IProductResponse extends ISharedProduct {
  createdAt: string;
  updatedAt: string;
}
export type ICreateProductRequest = IBaseSharedProduct;
export type IUpdateProductRequest = Partial<IBaseSharedProduct>;
