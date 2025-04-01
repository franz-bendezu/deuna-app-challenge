import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductInput } from './product.input';

describe('CreateProductInput', () => {
  it('should validate a valid input', async () => {
    const input = {
      nombre: 'Valid Product',
      descripcion: 'This is a valid product description',
      precio: 99.99,
      stock: 50,
    };

    const productInput = plainToInstance(CreateProductInput, input);
    const errors = await validate(productInput);

    expect(errors.length).toBe(0);
    expect(productInput.nombre).toBe(input.nombre);
    expect(productInput.descripcion).toBe(input.descripcion);
    expect(productInput.precio).toBe(input.precio);
    expect(productInput.stock).toBe(input.stock);
  });
});
