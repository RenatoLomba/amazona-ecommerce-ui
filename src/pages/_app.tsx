import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeContextProvider } from '../contexts/theme/theme-provider';
import { CartContextProvider } from '../contexts/cart/cart-provider';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);
  return (
    <CartContextProvider>
      <ThemeContextProvider>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </CartContextProvider>
  );
}
export default MyApp;
