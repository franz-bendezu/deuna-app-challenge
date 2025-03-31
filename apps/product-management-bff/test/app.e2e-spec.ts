import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, HttpException, HttpStatus } from '@nestjs/common';
import { ProductManagementBffModule } from '../src/product-management-bff.module';
import { ProductService } from '../src/services/product.service';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../src/dto/product.input';
import { ProductDTO } from '../src/dto/product.output';
import { Server } from 'net';
import { ApiError } from '../src/exceptions/api-error.exception';

const products: ProductDTO[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Product 3',
    description: 'Description 3',
    price: 300,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const gql = '/graphql';

describe('GraphQL ProductResolver (e2e)', () => {
  let app: INestApplication<Server>;
  let productService: ProductService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductManagementBffModule],
    })
      .overrideProvider(ProductService)
      .useValue({
        findAll: jest.fn().mockResolvedValue(products),
        findOne: jest
          .fn()
          .mockImplementation((id: string): Promise<ProductDTO> => {
            const product = products.find((p) => p.id === id);
            if (!product) {
              throw new ApiError(
                new Error('Product not found'),
                'Product not found',
                HttpStatus.NOT_FOUND,
              );
            }
            return Promise.resolve(product);
          }),
        create: jest
          .fn()
          .mockImplementation(
            (input: CreateProductInput): Promise<ProductDTO> => {
              const newProduct: ProductDTO = {
                id: '4',
                ...input,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              return Promise.resolve(newProduct);
            },
          ),
        update: jest
          .fn()
          .mockImplementation(
            (id: string, input: UpdateProductInput): Promise<ProductDTO> => {
              const product = products.find((p) => p.id === id);
              if (!product) {
                throw new ApiError(
                  new Error('Product not found'),
                  'Product not found',
                  HttpStatus.NOT_FOUND,
                );
              }
              const updatedProduct: ProductDTO = {
                ...product,
                ...input,
                updatedAt: new Date().toISOString(),
              };
              return Promise.resolve(updatedProduct);
            },
          ),
        remove: jest.fn().mockImplementation((id: string): Promise<boolean> => {
          const product = products.find((p) => p.id === id);
          if (!product) {
            throw new ApiError(
              new Error('Product not found'),
              'Product not found',
              HttpStatus.NOT_FOUND,
            );
          }
          return Promise.resolve(true);
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    productService = moduleFixture.get<ProductService>(ProductService);
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
            expect(res.body.data.products).toEqual(products);
            expect(productService.findAll).toHaveBeenCalled();
          });
      });

      describe('one product', () => {
        it('should get a single product', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                {
                  product(id: "2") {
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
              expect(res.body.data.product).toEqual(products[1]);
              expect(productService.findOne).toHaveBeenCalledWith('2');
            });
        });

        it('should get an error for bad id', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                {
                  product(id: "999") {
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
              expect(res.body.errors).toBeDefined();
              expect(res.body.data).toBe(null);
              expect(productService.findOne).toHaveBeenCalledWith('999');
            });
        });
      });

      it('should create a new product', () => {
        const newProductInput: CreateProductInput = {
          name: 'New Product',
          description: 'New description',
          price: 400,
          stock: 40,
        };

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
            expect(res.body.data.createProduct).toMatchObject({
              id: '4',
              name: 'New Product',
              description: 'New description',
              price: 400,
              stock: 40,
            });
            expect(productService.create).toHaveBeenCalledWith(newProductInput);
          });
      });

      it('should update an existing product', () => {
        const updateProductInput: UpdateProductInput = {
          name: 'Updated Product',
          price: 250,
        };

        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                updateProduct(
                  id: "2", 
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
            expect(res.body.data.updateProduct).toMatchObject({
              id: '2',
              name: 'Updated Product',
              description: 'Description 2',
              price: 250,
              stock: 20,
            });
            expect(productService.update).toHaveBeenCalledWith(
              '2',
              updateProductInput,
            );
          });
      });

      it('should delete a product', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                deleteProduct(id: "3")
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.deleteProduct).toBe(true);
            expect(productService.remove).toHaveBeenCalledWith('3');
          });
      });

      it('should handle error when deleting non-existent product', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              mutation {
                deleteProduct(id: "999")
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors).toBeDefined();
            expect(res.body.data).toBe(null);
            expect(productService.remove).toHaveBeenCalledWith('999');
          });
      });
    });
  });
});
