import { Product } from './product.model';

describe('Product Model', () => {
  it('should create a Product instance with the correct properties', () => {
    const id = '123';
    const name = 'Test Product';
    const description = 'This is a test product';
    const price = 99.99;
    const stock = 10;
    const createdAt = new Date();
    const updatedAt = new Date();

    const product = new Product(
      id,
      name,
      description,
      price,
      stock,
      createdAt,
      updatedAt,
    );

    expect(product.id).toBe(id);
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
    expect(product.stock).toBe(stock);
    expect(product.createdAt).toEqual(createdAt);
    expect(product.updatedAt).toEqual(updatedAt);
  });
});
