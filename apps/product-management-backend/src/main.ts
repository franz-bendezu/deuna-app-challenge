import { NestFactory } from '@nestjs/core';
import { ProductManagementBackendModule } from './product-management-backend.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProductManagementBackendModule);

  const config = new DocumentBuilder()
    .setTitle('DeUna Products API')
    .setDescription('API for Products Management in DeUna')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
