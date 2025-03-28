import { Module } from '@nestjs/common';
import { ProductManagementBackendController } from './product-management-backend.controller';
import { ProductManagementBackendService } from './product-management-backend.service';

@Module({
  imports: [],
  controllers: [ProductManagementBackendController],
  providers: [ProductManagementBackendService],
})
export class ProductManagementBackendModule {}
