import { createContext } from 'react';
import { CartItem } from '../../data/entities/cart-item.entity';
import { Product } from '../../data/entities/product.entity';
import { ShippingAddress } from '../../data/entities/shipping-address';

type CartContextData = {
  items: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  updateProductQty: (productId: string, newQty: number) => void;
  deleteFromCart: (productId: string) => void;
  cleanCart: () => void;
  shippingAddress?: ShippingAddress;
  changeAddress: (address: ShippingAddress) => void;
  paymentMethod?: string;
  savePaymentMethod: (paymentMethod: string) => void;
};

export const CartContext = createContext({} as CartContextData);
