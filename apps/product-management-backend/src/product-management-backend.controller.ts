import { Controller, Get } from '@nestjs/common';
import { ProductManagementBackendService } from './product-management-backend.service';

@Controller()
export class ProductManagementBackendController {
  constructor(
    private readonly productManagementBackendService: ProductManagementBackendService,
  ) {}

  @Get()
  getHello(): string {
    return this.productManagementBackendService.getHello();
  }
}
