import React, { ReactElement } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Container,
  CssBaseline,
  Link,
  Switch,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { useStyles } from '../styles/styles';
import { createDefaultTheme } from '../styles/create-theme';
import { useTheme } from '../hooks/useTheme';

type LayoutProps = {
  children: ReactElement;
  pageTitle: string;
  description?: string;
};

export const Layout = ({ pageTitle, description, children }: LayoutProps) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { navbar, main, footer, brand, grow } = useStyles();
  const theme = createDefaultTheme(darkMode);

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
              <Switch checked={darkMode} onChange={toggleDarkMode} />
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
