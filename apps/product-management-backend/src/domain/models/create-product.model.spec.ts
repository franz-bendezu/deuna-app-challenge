import { CreateProduct } from './create-product.model';

describe('CreateProduct', () => {
  it('should create an instance of CreateProduct with the correct properties', () => {
    const name = 'Test Product';
    const description = 'This is a test product';
    const price = 100;
    const stock = 50;

    const product = new CreateProduct(name, description, price, stock);

    expect(product).toBeInstanceOf(CreateProduct);
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
    expect(product.stock).toBe(stock);
  });

  it('should allow updating properties of CreateProduct', () => {
    const product = new CreateProduct('Old Name', 'Old Description', 50, 10);

    product.name = 'New Name';
    product.description = 'New Description';
    product.price = 200;
    product.stock = 100;

    expect(product.name).toBe('New Name');
    expect(product.description).toBe('New Description');
    expect(product.price).toBe(200);
    expect(product.stock).toBe(100);
  });
});
