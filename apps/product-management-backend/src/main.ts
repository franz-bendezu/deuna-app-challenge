import { NestFactory } from '@nestjs/core';
import { ProductManagementBackendModule } from './product-management-backend.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductManagementBackendModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
