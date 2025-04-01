import { NestFactory } from '@nestjs/core';
import { ProductManagementBackendModule } from './product-management-backend.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppConfiguration } from './infrastructure/interfaces/env-config.interface';
import { ConfigService } from '@nestjs/config';

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
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService<AppConfiguration>);
  const port = configService.get<number>('port');
  await app.listen(port ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
