import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import '../styles/globals.css';
import { ThemeContextProvider } from '../contexts/theme/theme-provider';
import { CartContextProvider } from '../contexts/cart/cart-provider';
import { UserContextProvider } from '../contexts/user/user-provider';

const paypalInitialOptions = {
  'client-id': 'test',
  currency: 'USD',
  intent: 'capture',
};

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
            <PayPalScriptProvider
              options={paypalInitialOptions}
              deferLoading={true}
            >
              <Component {...pageProps} />
            </PayPalScriptProvider>
          </ThemeContextProvider>
        </SnackbarProvider>
      </CartContextProvider>
    </UserContextProvider>
  );
}
export default MyApp;
