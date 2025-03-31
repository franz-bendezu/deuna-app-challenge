import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductManagementBffModule } from './../src/product-management-bff.module';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ProductManagementBffController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  const mockProduct = {
    id: '12345',
    name: 'Test Product',
    description: 'A product for e2e testing',
    price: 99.99,
    category: 'test',
    imageUrl: 'http://example.com/image.jpg',
    stock: 100,
  };

  const mockProducts = [
    mockProduct,
    {
      id: '67890',
      name: 'Another Product',
      description: 'Another product description',
      price: 49.99,
      category: 'test',
      imageUrl: 'http://example.com/another-image.jpg',
      stock: 50,
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    })
      .overrideProvider(HttpService)
      .useValue({
        get: jest.fn().mockImplementation((url) => {
          if (url.includes('/products/12345')) {
            return of({
              data: mockProduct,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {},
            });
          } else if (url.includes('/products')) {
            return of({
              data: mockProducts,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {},
            });
          }
        }),
        post: jest.fn().mockImplementation(() => {
          return of({
            data: mockProduct,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: {},
          });
        }),
        put: jest.fn().mockImplementation(() => {
          return of({
            data: { ...mockProduct, name: 'Updated Product' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          });
        }),
        delete: jest.fn().mockImplementation(() => {
          return of({
            data: null,
            status: 204,
            statusText: 'No Content',
            headers: {},
            config: {},
          });
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Products API', () => {
    it('should fetch all products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0].id).toBe('12345');
        });
    });

    it('should fetch a product by id', () => {
      return request(app.getHttpServer())
        .get('/products/12345')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('12345');
          expect(res.body.name).toBe('Test Product');
        });
    });

    it('should create a new product', () => {
      const newProduct = {
        name: 'New Product',
        description: 'Brand new product',
        price: 129.99,
        category: 'new',
        imageUrl: 'http://example.com/new-image.jpg',
        stock: 75,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(newProduct)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
        });
    });

    it('should update a product', () => {
      const updatedProduct = {
        ...mockProduct,
        name: 'Updated Product',
      };

      return request(app.getHttpServer())
        .put('/products/12345')
        .send(updatedProduct)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Product');
        });
    });

    it('should delete a product', () => {
      return request(app.getHttpServer()).delete('/products/12345').expect(204);
    });
  });
});
