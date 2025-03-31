import { IBaseSharedProduct, ISharedProduct } from '@app/shared';

export interface IProductResponse extends ISharedProduct {
  fechaCreacion: string;
  fechaActualizacion: string;
}
export type ICreateProductRequest = IBaseSharedProduct;
export type IUpdateProductRequest = Partial<IBaseSharedProduct>;
