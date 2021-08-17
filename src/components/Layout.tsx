import React, { ReactElement } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';

import { useStyles } from '../styles/styles';

type LayoutProps = {
  children: ReactElement;
  pageTitle: string;
};

export const Layout = ({ pageTitle, children }: LayoutProps) => {
  const { navbar, main, footer, brand, grow } = useStyles();

  return (
    <div>
      <Head>
        <title>Amazona - {pageTitle}</title>
      </Head>
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
    </div>
  );
};
