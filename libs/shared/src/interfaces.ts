export interface IBaseSharedProduct {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
}

export interface ICreateSharedProduct extends IBaseSharedProduct {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface ISharedProduct extends ICreateSharedProduct {
  id: string;
  fechaCreacion: string | Date;
  fechaActualizacion: string | Date;
}
