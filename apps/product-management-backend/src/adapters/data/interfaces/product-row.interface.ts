export interface IProductRow {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number | string;
  createdAt: Date;
  updatedAt: Date;
}
