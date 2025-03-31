import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ProductManagementBffModule } from '../src/product-management-bff.module';
import { ProductService } from '../src/services/product.service';
import { ProductDTO } from '../src/dto/product.output';
import { Server } from 'net';
import { MemoryProductService } from './mocks/memory-product.service';

const gql = '/graphql';

describe('GraphQL ProductResolver (e2e)', () => {
  let app: INestApplication<Server>;
  const inMemoryService = new MemoryProductService();
  let initialProducts: ProductDTO[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    })
      .overrideProvider(ProductService)
      .useValue(inMemoryService)
      .compile();

    app = moduleFixture.createNestApplication();

    initialProducts = await inMemoryService.findAll();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(gql, () => {
    describe('products', () => {
      it('should get the products array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              { 
                products {
                  id
                  name
                  description
                  price
                  stock
                  createdAt
                  updatedAt
                }
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            const body = res.body as {
              data: {
                products: ProductDTO[];
              };
            };
            expect(body.data.products.length).toEqual(initialProducts.length);
          });
      });

      describe('one product', () => {
        it('should get a single product', () => {
          const targetProduct = initialProducts[1];
          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                {
                  product(id: "${targetProduct.id}") {
                    id
                    name
                    description
                    price
                    stock
                    createdAt
                    updatedAt
                  }
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                data: {
                  product: ProductDTO;
                };
              };
              expect(body.data.product).toEqual(targetProduct);
            });
        });

        it('should get an error for bad id', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                {
                  product(id: "non-existent-id") {
                    id
                    name
                    description
                    price
                    stock
                    createdAt
                    updatedAt
                  }
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                errors: unknown[];
                data: null;
              };
              expect(body.errors).toBeDefined();
              expect(body.data).toBe(null);
            });
        });
      });

      it('should create a new product', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                createProduct(input: {
                  name: "New Product",
                  description: "New description",
                  price: 400,
                  stock: 40
                }) {
                  id
                  name
                  description
                  price
                  stock
                  createdAt
                  updatedAt
                }
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            const body = res.body as {
              data: {
                createProduct: ProductDTO;
              };
            };
            expect(body.data.createProduct).toMatchObject({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(String),
              name: 'New Product',
              description: 'New description',
              price: 400,
              stock: 40,
            });
          });
      });

      it('should update an existing product', () => {
        const targetProduct = initialProducts[1];

        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                updateProduct(
                  id: "${targetProduct.id}", 
                  input: {
                    name: "Updated Product",
                    price: 250
                  }
                ) {
                  id
                  name
                  description
                  price
                  stock
                  createdAt
                  updatedAt
                }
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            const body = res.body as {
              data: {
                updateProduct: ProductDTO;
              };
            };
            expect(body.data.updateProduct).toMatchObject({
              id: targetProduct.id,
              name: 'Updated Product',
              description: targetProduct.description,
              price: 250,
              stock: targetProduct.stock,
            });
          });
      });

      it('should delete a product', () => {
        const targetProduct = initialProducts[2];
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                deleteProduct(id: "${targetProduct.id}")
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            const body = res.body as {
              data: {
                deleteProduct: boolean;
              };
            };
            expect(body.data.deleteProduct).toBe(true);
          });
      });

      it('should handle error when deleting non-existent product', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                deleteProduct(id: "non-existent-id")
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            const body = res.body as {
              errors: unknown[];
              data: null;
            };
            expect(body.errors).toBeDefined();
            expect(body.data).toBe(null);
          });
      });
    });
  });
});
