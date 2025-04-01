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
    describe('productos', () => {
      it('should get the products array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
              { 
                productos {
                  id
                  nombre
                  descripcion
                  precio
                  stock
                  fechaCreacion
                  fechaActualizacion
                }
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            const body = res.body as {
              data: {
                productos: ProductDTO[];
              };
            };
            expect(body.data.productos.length).toEqual(initialProducts.length);
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
                  producto(id: "${targetProduct.id}") {
                    id
                    nombre
                    descripcion
                    precio
                    stock
                    fechaCreacion
                    fechaActualizacion
                  }
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                data: {
                  producto: ProductDTO;
                };
              };
              expect(body.data.producto).toBeDefined();
              expect(body.data.producto.id).toEqual(targetProduct.id);
            });
        });

        it('should return null for nonexistent product', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                {
                  producto(id: "${crypto.randomUUID()}") {
                    id
                    nombre
                  }
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                data: null;
              };
              expect(body.data).toBeNull();
            });
        });
      });
    });

    describe('mutations', () => {
      describe('crearProducto', () => {
        const newProduct = {
          nombre: 'New Product',
          descripcion: 'This is a new product',
          precio: 29.99,
          stock: 100,
        };

        it('should create a new product', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                mutation {
                  crearProducto(input: {
                    nombre: "${newProduct.nombre}",
                    descripcion: "${newProduct.descripcion}",
                    precio: ${newProduct.precio},
                    stock: ${newProduct.stock}
                  }) {
                    id
                    nombre
                    descripcion
                    precio
                    stock
                  }
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                data: {
                  crearProducto: ProductDTO;
                };
              };
              expect(body.data.crearProducto).toBeDefined();
              expect(body.data.crearProducto.nombre).toEqual(newProduct.nombre);
              expect(body.data.crearProducto.descripcion).toEqual(
                newProduct.descripcion,
              );
              expect(body.data.crearProducto.precio).toEqual(newProduct.precio);
              expect(body.data.crearProducto.stock).toEqual(newProduct.stock);
            });
        });
      });

      describe('actualizarProducto', () => {
        it('should update an existing product', async () => {
          const products = await inMemoryService.findAll();
          const productToUpdate = products[0];
          const updatedFields = {
            nombre: 'Updated Product Name',
            precio: 39.99,
          };

          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                mutation {
                  actualizarProducto(
                    id: "${productToUpdate.id}"
                    input: {
                      nombre: "${updatedFields.nombre}",
                      precio: ${updatedFields.precio}
                    }
                  ) {
                    id
                    nombre
                    precio
                    descripcion
                    stock
                  }
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                data: {
                  actualizarProducto: ProductDTO;
                };
              };
              expect(body.data.actualizarProducto).toBeDefined();
              expect(body.data.actualizarProducto.id).toEqual(
                productToUpdate.id,
              );
              expect(body.data.actualizarProducto.nombre).toEqual(
                updatedFields.nombre,
              );
              expect(body.data.actualizarProducto.precio).toEqual(
                updatedFields.precio,
              );
              // Description and stock should remain unchanged
              expect(body.data.actualizarProducto.descripcion).toEqual(
                productToUpdate.descripcion,
              );
              expect(body.data.actualizarProducto.stock).toEqual(
                productToUpdate.stock,
              );
            });
        });
      });

      describe('eliminarProducto', () => {
        it('should delete a product', async () => {
          const products = await inMemoryService.findAll();
          const productToDelete = products[products.length - 1];

          return request(app.getHttpServer())
            .post(gql)
            .send({
              query: `
                mutation {
                  eliminarProducto(id: "${productToDelete.id}")
                }
              `,
            })
            .expect(200)
            .expect((res) => {
              const body = res.body as {
                data: {
                  eliminarProducto: boolean;
                };
              };
              expect(body.data.eliminarProducto).toBe(true);
            });
        });
      });
    });
  });
});
