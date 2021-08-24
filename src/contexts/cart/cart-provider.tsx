import React, { FC, useEffect, useState } from 'react';
import { CartContext } from '.';
import { CartItem } from '../../data/entities/cart-item.entity';
import { Product } from '../../data/entities/product.entity';
import { localStorageHelper } from '../../utils/local-storage-helper';

export const CartContextProvider: FC = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const changeCartItems = (newCartItems: CartItem[]) => {
    localStorageHelper.set('cart-items', newCartItems);
    setItems(newCartItems);
  };

  const addToCart = (product: Product, qty: number) => {
    const itemAlreadyInCart = items.findIndex(
      (item) => item.product._id === product._id,
    );
    const newCartItems: CartItem[] = [...items];
    if (itemAlreadyInCart !== -1) {
      const currentCountInStock = items[itemAlreadyInCart].product.countInStock;
      const currentQty = items[itemAlreadyInCart].qty;
      const newQty = qty + currentQty;

      newCartItems[itemAlreadyInCart] = {
        product,
        qty: newQty > currentCountInStock ? currentQty : newQty,
      };
    } else {
      newCartItems.push({ product, qty });
    }

    changeCartItems(newCartItems);
  };

  const updateProductQty = (productId: string, newQty: number) => {
    const itemExists = items.find((item) => item.product._id === productId);
    if (!itemExists) return;
    const newCartItems: CartItem[] = items.map((item) =>
      item.product._id === itemExists.product._id
        ? { product: item.product, qty: newQty }
        : item,
    );

    changeCartItems(newCartItems);
  };

  const deleteFromCart = (productId: string) => {
    const itemIndex = items.findIndex(
      ({ product }) => product._id === productId,
    );
    if (itemIndex === -1) return;
    const newCartItems = [...items];
    newCartItems.splice(itemIndex, 1);

    changeCartItems(newCartItems);
  };

  const cleanCart = () => {
    localStorageHelper.remove('cart-items');
    setItems([]);
  };

  useEffect(() => {
    const cartItems = localStorageHelper.get<CartItem[]>('cart-items');
    if (!cartItems) return;
    setItems(cartItems);
  }, []);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateProductQty, deleteFromCart, cleanCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
