import { Module } from '@nestjs/common';
import { ProductManagementBffController } from './product-management-bff.controller';
import { ProductManagementBffService } from './product-management-bff.service';

@Module({
  imports: [],
  controllers: [ProductManagementBffController],
  providers: [ProductManagementBffService],
})
export class ProductManagementBffModule {}
