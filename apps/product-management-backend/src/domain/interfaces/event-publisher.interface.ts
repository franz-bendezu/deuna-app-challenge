import { ProductEvents } from '../constants/events';
import { Product } from '../models/product.model';

export interface IProductPublisher {
  publish(this: void, tsopic: ProductEvents, message: Product): Promise<void>;
}
