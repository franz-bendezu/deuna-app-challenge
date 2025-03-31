import { IBaseSharedProduct, ISharedProduct } from '@app/shared';

export interface ProductResponse extends ISharedProduct {
  createdAt: string;
  updatedAt: string;
}
export type CreateProductRequest = IBaseSharedProduct;
export type UpdateProductRequest = Partial<IBaseSharedProduct>;
