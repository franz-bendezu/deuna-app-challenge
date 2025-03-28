import { Test, TestingModule } from '@nestjs/testing';
import { ProductManagementBffController } from './product-management-bff.controller';
import { ProductManagementBffService } from './product-management-bff.service';

describe('ProductManagementBffController', () => {
  let productManagementBffController: ProductManagementBffController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductManagementBffController],
      providers: [ProductManagementBffService],
    }).compile();

    productManagementBffController = app.get<ProductManagementBffController>(
      ProductManagementBffController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productManagementBffController.getHello()).toBe('Hello World!');
    });
  });
});
