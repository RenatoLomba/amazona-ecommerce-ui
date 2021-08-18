import React, { ReactElement } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Container,
  CssBaseline,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import { useStyles } from '../styles/styles';

type LayoutProps = {
  children: ReactElement;
  pageTitle: string;
  description?: string;
};

export const Layout = ({ pageTitle, description, children }: LayoutProps) => {
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontweight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontweight: 400,
        margin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },
    palette: {
      type: 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const { navbar, main, footer, brand, grow } = useStyles();

  return (
    <div>
      <Head>
        <title>Amazona - {pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar className={navbar} position="static">
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={brand}>amazona</Typography>
              </Link>
            </NextLink>
            <div className={grow}></div>
            <div>
              <NextLink href="/cart" passHref>
                <Link>Cart</Link>
              </NextLink>
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={main}>{children}</Container>
        <footer className={footer}>
          <Typography>All rights reserved. Amazona.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};
