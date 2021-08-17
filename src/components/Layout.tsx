import React, { ReactElement } from 'react';
import Head from 'next/head';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';

type LayoutProps = {
  children: ReactElement;
  pageTitle: string;
};

export const Layout = ({ pageTitle, children }: LayoutProps) => {
  return (
    <div>
      <Head>
        <title>Amazona - {pageTitle}</title>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography>amazona</Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
      <footer>
        <Typography>All rights reserved. Amazona.</Typography>
      </footer>
    </div>
  );
};
