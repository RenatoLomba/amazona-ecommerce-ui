import React, { FC, ReactElement, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Badge,
  Button,
  Container,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { useStyles } from '../styles/styles';
import { createDefaultTheme } from '../styles/create-theme';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';
import { useRouter } from 'next/dist/client/router';

type LayoutProps = {
  pageTitle: string;
  description?: string;
};

export const Layout: FC<LayoutProps> = ({
  pageTitle,
  description,
  children,
}) => {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();
  const { items, clearCart } = useCart();
  const { loggedUser, logoutUser } = useUser();
  const { navbar, main, footer, brand, grow, navbarButton } = useStyles();
  const theme = createDefaultTheme(darkMode);

  const [anchorEl, setAnchorEl] = useState<Element>();

  const loginClickHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler: React.MouseEventHandler<HTMLLIElement> = () => {
    setAnchorEl(undefined);
  };

  const logoutHandler = () => {
    setAnchorEl(undefined);
    clearCart();

    logoutUser();

    router.push('/login');
  };

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
                <Link>
                  {items.length > 0 ? (
                    <Badge badgeContent={items.length} color="secondary">
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {loggedUser ? (
                <>
                  <Button
                    className={navbarButton}
                    aria-controls="login-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                  >
                    {loggedUser.name}
                  </Button>
                  <Menu
                    id="login-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={main}>{children as ReactElement}</Container>
        <footer className={footer}>
          <Typography>All rights reserved. Amazona.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};
