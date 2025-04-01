import {
  IBaseSharedProduct,
  ICreateSharedProduct,
  ISharedProduct,
} from '@app/shared';

export interface IProductResponse extends ISharedProduct {
  fechaCreacion: string;
  fechaActualizacion: string;
}
export type ICreateProductRequest = ICreateSharedProduct;
export type IUpdateProductRequest = IBaseSharedProduct;
