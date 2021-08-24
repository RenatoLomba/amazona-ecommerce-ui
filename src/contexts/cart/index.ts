import { createContext } from 'react';
import { CartItem } from '../../data/entities/cart-item.entity';
import { Product } from '../../data/entities/product.entity';

type CartContextData = {
  items: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  updateProductQty: (productId: string, newQty: number) => void;
  deleteFromCart: (productId: string) => void;
  cleanCart: () => void;
};

export const CartContext = createContext({} as CartContextData);
