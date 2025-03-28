import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductManagementBffService {
  getHello(): string {
    return 'Hello World!';
  }
}
