import React, { ReactElement } from 'react';
import Head from 'next/head';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';
import { useStyles } from '../styles/styles';

type LayoutProps = {
  children: ReactElement;
  pageTitle: string;
};

export const Layout = ({ pageTitle, children }: LayoutProps) => {
  const { navbar, main, footer } = useStyles();

  return (
    <div>
      <Head>
        <title>Amazona - {pageTitle}</title>
      </Head>
      <AppBar className={navbar} position="static">
        <Toolbar>
          <Typography>amazona</Typography>
        </Toolbar>
      </AppBar>
      <Container className={main}>{children}</Container>
      <footer className={footer}>
        <Typography>All rights reserved. Amazona.</Typography>
      </footer>
    </div>
  );
};
