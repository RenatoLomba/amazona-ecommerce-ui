import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeContextProvider } from '../contexts/theme/theme-provider';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}
export default MyApp;
