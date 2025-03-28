import { Test, TestingModule } from '@nestjs/testing';
import { ProductManagementBackendController } from './product-management-backend.controller';
import { ProductManagementBackendService } from './product-management-backend.service';

describe('ProductManagementBackendController', () => {
  let productManagementBackendController: ProductManagementBackendController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductManagementBackendController],
      providers: [ProductManagementBackendService],
    }).compile();

    productManagementBackendController =
      app.get<ProductManagementBackendController>(
        ProductManagementBackendController,
      );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productManagementBackendController.getHello()).toBe(
        'Hello World!',
      );
    });
  });
});
