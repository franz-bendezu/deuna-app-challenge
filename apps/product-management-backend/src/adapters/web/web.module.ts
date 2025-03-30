import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [ProductsController],
})
export class AdaptersWebModule {}
