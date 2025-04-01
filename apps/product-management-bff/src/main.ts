import { NestFactory } from '@nestjs/core';
import { ProductManagementBffModule } from './product-management-bff.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductManagementBffModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
