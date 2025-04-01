import envConfig from './configuration';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default values when environment variables are not set', () => {
    // Clear relevant environment variables
    delete process.env.BFF_PORT;
    delete process.env.BACKEND_URL;
    delete process.env.BACKEND_PRODUCTS_ENDPOINT;

    const config = envConfig();

    expect(config.port).toBe(3001);
    expect(config.backend.url).toBe('http://localhost:3000');
    expect(config.backend.productsEndpoint).toBe('/productos');
  });

  it('should use environment variables when set', () => {
    // Set environment variables
    process.env.BFF_PORT = '4000';
    process.env.BACKEND_URL = 'http://api.example.com';
    process.env.BACKEND_PRODUCTS_ENDPOINT = '/api/productos';

    const config = envConfig();

    expect(config.port).toBe(4000);
    expect(config.backend.url).toBe('http://api.example.com');
    expect(config.backend.productsEndpoint).toBe('/api/productos');
  });
});
