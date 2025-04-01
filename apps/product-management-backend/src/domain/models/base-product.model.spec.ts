import { BaseProduct } from './base-product.model';

describe('BaseProduct', () => {
  it('should create an instance with default values', () => {
    const product = new BaseProduct();
    expect(product.name).toBeUndefined();
    expect(product.description).toBeUndefined();
    expect(product.price).toBeUndefined();
    expect(product.stock).toBeUndefined();
  });

  it('should create an instance with provided values', () => {
    const product = new BaseProduct('Product A', 'Description A', 100, 10);
    expect(product.name).toBe('Product A');
    expect(product.description).toBe('Description A');
    expect(product.price).toBe(100);
    expect(product.stock).toBe(10);
  });

  it('should allow updating properties after creation', () => {
    const product = new BaseProduct();
    product.name = 'Updated Product';
    product.description = 'Updated Description';
    product.price = 200;
    product.stock = 20;

    expect(product.name).toBe('Updated Product');
    expect(product.description).toBe('Updated Description');
    expect(product.price).toBe(200);
    expect(product.stock).toBe(20);
  });
});
