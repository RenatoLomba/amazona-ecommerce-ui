import React, { FC, useEffect, useState } from 'react';
import nookies from 'nookies';
import { CartContext } from '.';
import { CartItem } from '../../data/entities/cart-item.entity';
import { Product } from '../../data/entities/product.entity';
import { ShippingAddress } from '../../data/entities/shipping-address';

export const CartContextProvider: FC = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>();
  const [paymentMethod, setPaymentMethod] = useState('');

  const changeAddress = (address: ShippingAddress) => {
    nookies.set(null, 'SHIPPING_ADDRESS', JSON.stringify(address));
    setShippingAddress(address);
  };

  const changeCartItems = (newCartItems: CartItem[]) => {
    nookies.set(null, 'CART_ITEMS', JSON.stringify(newCartItems));
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
    nookies.destroy(null, 'CART_ITEMS');
    setItems([]);
  };

  const savePaymentMethod = (paymentMethod: string) => {
    nookies.set(null, 'PAYMENT_METHOD', paymentMethod);
    setPaymentMethod(paymentMethod);
  };

  useEffect(() => {
    const getStoredItems = () => {
      const { CART_ITEMS } = nookies.get(null);
      if (!CART_ITEMS) return;
      setItems(JSON.parse(CART_ITEMS));
    };

    const getStoredAddress = () => {
      const { SHIPPING_ADDRESS } = nookies.get(null);
      if (!SHIPPING_ADDRESS) return;
      setShippingAddress(JSON.parse(SHIPPING_ADDRESS));
    };

    const getPaymentMethod = () => {
      const { PAYMENT_METHOD } = nookies.get(null);
      if (!PAYMENT_METHOD) return;
      setPaymentMethod(PAYMENT_METHOD);
    };

    getStoredItems();
    getStoredAddress();
    getPaymentMethod();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateProductQty,
        deleteFromCart,
        cleanCart,
        changeAddress,
        shippingAddress,
        savePaymentMethod,
        paymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
