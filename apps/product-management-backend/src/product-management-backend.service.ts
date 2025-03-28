import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductManagementBackendService {
  getHello(): string {
    return 'Hello World!';
  }
}
