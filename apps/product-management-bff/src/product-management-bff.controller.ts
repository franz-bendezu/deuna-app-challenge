import { Controller, Get } from '@nestjs/common';
import { ProductManagementBffService } from './product-management-bff.service';

@Controller()
export class ProductManagementBffController {
  constructor(
    private readonly productManagementBffService: ProductManagementBffService,
  ) {}

  @Get()
  getHello(): string {
    return this.productManagementBffService.getHello();
  }
}
