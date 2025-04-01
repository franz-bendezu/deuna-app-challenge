import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateProductInput } from './product.input';

describe('UpdateProductInput', () => {
  it('should validate a valid input with all fields', async () => {
    const input = {
      nombre: 'Updated Product',
      descripcion: 'This is an updated product description',
      precio: 149.99,
      stock: 75,
    };

    const productInput = plainToInstance(UpdateProductInput, input);
    const errors = await validate(productInput);

    expect(errors.length).toBe(0);
    expect(productInput.nombre).toBe(input.nombre);
    expect(productInput.descripcion).toBe(input.descripcion);
    expect(productInput.precio).toBe(input.precio);
    expect(productInput.stock).toBe(input.stock);
  });

  it('should validate a valid input with partial fields', async () => {
    const input = {
      nombre: 'Partially Updated Product',
      precio: 129.99,
    };

    const productInput = plainToInstance(UpdateProductInput, input);
    const errors = await validate(productInput);

    expect(errors.length).toBe(0);
    expect(productInput.nombre).toBe(input.nombre);
    expect(productInput.precio).toBe(input.precio);
    expect(productInput.descripcion).toBeUndefined();
    expect(productInput.stock).toBeUndefined();
  });

  it('should validate an empty input', async () => {
    const input = {};

    const productInput = plainToInstance(UpdateProductInput, input);
    const errors = await validate(productInput);

    expect(errors.length).toBe(0); // All fields are optional
  });
});
