import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ProductManagementBackendModule } from './../src/product-management-backend.module';
import { INestApplication } from '@nestjs/common';
import { Server } from 'net';
import { BaseProductDto } from '../src/adapters/web/dtos/base-product.dto';
import { ProductDTO } from '../src/adapters/web/dtos/product.dto';

describe('Products Controller (e2e)', () => {
  let app: INestApplication<Server>;
  let createdProductId: string;

  const testProduct: BaseProductDto = {
    name: 'Test Product',
    description: 'A product for e2e testing',
    price: 99.99,
    stock: 100,
  };

  const updatedProduct: BaseProductDto = {
    name: 'Updated Test Product',
    description: 'Updated description for testing',
    price: 199.99,
    stock: 50,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductManagementBackendModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new product', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send(testProduct)
      .expect(201)
      .expect((res: request.Response) => {
        const body = res.body as ProductDTO;
        expect(body).toHaveProperty('id');
        expect(body.name).toBe(testProduct.name);
        expect(body.description).toBe(testProduct.description);
        expect(body.price).toBe(testProduct.price);
        createdProductId = body.id; // Store for later tests
      });
  });

  it('should get all products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO[];
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeGreaterThan(0);
      });
  });

  it('should get a product by id', () => {
    return request(app.getHttpServer())
      .get(`/products/${createdProductId}`)
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO;
        expect(body).toHaveProperty('id', createdProductId);
        expect(body).toBe(testProduct.name);
      });
  });

  it('should update a product', () => {
    return request(app.getHttpServer())
      .put(`/products/${createdProductId}`)
      .send({ ...updatedProduct, id: createdProductId })
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO;
        expect(body).toHaveProperty('id', createdProductId);
        expect(body.name).toBe(updatedProduct.name);
        expect(body.description).toBe(updatedProduct.description);
        expect(body.price).toBe(updatedProduct.price);
      });
  });

  it('should delete a product', () => {
    return request(app.getHttpServer())
      .delete(`/products/${createdProductId}`)
      .expect(204);
  });

  it('should return 404 for deleted product', () => {
    return request(app.getHttpServer())
      .get(`/products/${createdProductId}`)
      .expect(404);
  });
});
