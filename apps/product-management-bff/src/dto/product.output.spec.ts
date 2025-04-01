import { ProductDTO } from './product.output';

describe('ProductDTO', () => {
  it('should create a product DTO with all properties', () => {
    const now = new Date().toISOString();
    const productDto = new ProductDTO();

    productDto.id = '1';
    productDto.nombre = 'Test Product';
    productDto.descripcion = 'Test Description';
    productDto.precio = 99.99;
    productDto.stock = 50;
    productDto.fechaCreacion = now;
    productDto.fechaActualizacion = now;

    expect(productDto.id).toBe('1');
    expect(productDto.nombre).toBe('Test Product');
    expect(productDto.descripcion).toBe('Test Description');
    expect(productDto.precio).toBe(99.99);
    expect(productDto.stock).toBe(50);
    expect(productDto.fechaCreacion).toBe(now);
    expect(productDto.fechaActualizacion).toBe(now);
  });

  it('should handle undefined optional properties', () => {
    const productDto = new ProductDTO();

    productDto.id = '1';
    productDto.nombre = 'Test Product';
    productDto.precio = 99.99;

    expect(productDto.id).toBe('1');
    expect(productDto.nombre).toBe('Test Product');
    expect(productDto.precio).toBe(99.99);
    expect(productDto.descripcion).toBeUndefined();
    expect(productDto.stock).toBeUndefined();
    expect(productDto.fechaCreacion).toBeUndefined();
    expect(productDto.fechaActualizacion).toBeUndefined();
  });
});
