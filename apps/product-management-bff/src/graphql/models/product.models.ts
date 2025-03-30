export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
