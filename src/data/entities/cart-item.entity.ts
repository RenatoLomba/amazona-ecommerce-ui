import { Product } from './product.entity';

export type CartItem = {
  product: Product;
  qty: number;
};
