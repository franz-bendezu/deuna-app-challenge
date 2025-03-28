import { NestFactory } from '@nestjs/core';
import { ProductManagementBffModule } from './product-management-bff.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductManagementBffModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
