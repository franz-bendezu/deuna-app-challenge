import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ProductManagementBackendModule } from './../src/product-management-backend.module';
import { INestApplication } from '@nestjs/common';
import { Server } from 'net';
import { CreateProductDto } from '../src/adapters/web/dtos/create-product.dto';
import { ProductDTO } from '../src/adapters/web/dtos/product.dto';
import { ProductsController } from '../src/adapters/web/controllers/products.controller';

describe('Products Controller (e2e)', () => {
  let app: INestApplication<Server>;
  let createdProductId: string;

  const testProduct: CreateProductDto = {
    nombre: 'Test Product',
    descripcion: 'A product for e2e testing',
    precio: 99.99,
    stock: 100,
  };

  const updatedProduct: CreateProductDto = {
    nombre: 'Updated Test Product',
    descripcion: 'Updated description for testing',
    precio: 199.99,
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
      .post(`/${ProductsController.PATH}`)
      .send(testProduct)
      .expect(201)
      .expect((res: request.Response) => {
        const body = res.body as ProductDTO;
        expect(body).toHaveProperty('id');
        expect(body.nombre).toBe(testProduct.nombre);
        expect(body.descripcion).toBe(testProduct.descripcion);
        expect(body.precio).toBe(testProduct.precio);
        createdProductId = body.id; // Store for later tests
        expect(body.stock).toBe(testProduct.stock);
        expect(body.fechaCreacion).toBeDefined();
        expect(body.fechaActualizacion).toBeDefined();
      });
  });

  it('should get all products', () => {
    return request(app.getHttpServer())
      .get(`/${ProductsController.PATH}`)
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO[];
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        const product = body.find((p) => p.id === createdProductId);
        expect(product).toBeDefined();
      });
  });

  it('should get a product by id', () => {
    return request(app.getHttpServer())
      .get(`/${ProductsController.PATH}/${createdProductId}`)
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO;
        expect(body).toHaveProperty('id', createdProductId);
        expect(body.nombre).toBe(testProduct.nombre);
        expect(body.descripcion).toBe(testProduct.descripcion);
        expect(body.precio).toBe(testProduct.precio);
        expect(body.stock).toBe(testProduct.stock);
        expect(body.fechaCreacion).toBeDefined();
        expect(body.fechaActualizacion).toBeDefined();
      });
  });

  it('should update a product', () => {
    return request(app.getHttpServer())
      .put(`/${ProductsController.PATH}/${createdProductId}`)
      .send({ ...updatedProduct, id: createdProductId })
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO;
        expect(body).toHaveProperty('id', createdProductId);
        expect(body.nombre).toBe(updatedProduct.nombre);
        expect(body.descripcion).toBe(updatedProduct.descripcion);
        expect(body.precio).toBe(updatedProduct.precio);
        expect(body.stock).toBe(updatedProduct.stock);
        expect(body.fechaCreacion).toBeDefined();
      });
  });

  it('should delete a product', () => {
    return request(app.getHttpServer())
      .delete(`/${ProductsController.PATH}/${createdProductId}`)
      .expect(204);
  });

  it('should return 404 for deleted product', () => {
    return request(app.getHttpServer())
      .get(`/${ProductsController.PATH}/${createdProductId}`)
      .expect(404);
  });
});
