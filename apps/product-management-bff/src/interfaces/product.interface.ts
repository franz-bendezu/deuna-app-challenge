import { IBaseSharedProduct, ISharedProduct } from '@app/shared';

export type ProductResponse = ISharedProduct;
export type CreateProductRequest = IBaseSharedProduct;
export type UpdateProductRequest = Partial<IBaseSharedProduct>;
