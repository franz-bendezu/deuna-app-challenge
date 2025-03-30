import { Module } from '@nestjs/common';
import { AdaptersWebModule } from './adapters/web/web.module';

@Module({
  imports: [AdaptersWebModule],
})
export class ProductManagementBackendModule {}
