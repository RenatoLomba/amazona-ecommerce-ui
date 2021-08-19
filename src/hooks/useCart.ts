import { useContext } from 'react';
import { CartContext } from '../contexts/cart';

export const useCart = () => {
  return useContext(CartContext);
};
