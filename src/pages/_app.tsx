import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeContextProvider } from '../contexts/theme/theme-provider';
import { CartContextProvider } from '../contexts/cart/cart-provider';
import { UserContextProvider } from '../contexts/user/user-provider';
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);
  return (
    <UserContextProvider>
      <CartContextProvider>
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <ThemeContextProvider>
            <Component {...pageProps} />
          </ThemeContextProvider>
        </SnackbarProvider>
      </CartContextProvider>
    </UserContextProvider>
  );
}
export default MyApp;
