export interface IBaseSharedProduct {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface ISharedProduct extends IBaseSharedProduct {
  id: string;
  fechaCreacion: string | Date;
  fechaActualizacion: string | Date;
}
