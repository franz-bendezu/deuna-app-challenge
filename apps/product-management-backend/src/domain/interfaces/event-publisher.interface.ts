import { ProductEvents } from '../constants/events';
import { Product } from '../models/product.model';

export interface IProductPublisher {
  publish(tsopic: ProductEvents, message: Product): Promise<void>;
}
