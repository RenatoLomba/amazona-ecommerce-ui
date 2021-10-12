import React from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import Image from 'next/image';
import nookies from 'nookies';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { Layout } from '../components/layout';
import { CartItem } from '../data/entities/cart-item.entity';
import { userService } from '../data/services/user.service';
import { useRouter } from 'next/router';
import { useCart } from '../hooks/useCart';
import { useStyles } from '../styles/styles';
import { CheckOutWizard } from '../components/checkout-wizard';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { useState } from 'react';
import { orderService } from '../data/services/order.service';

export default function PlaceOrder() {
  const router = useRouter();
  const { section } = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { items, shippingAddress, paymentMethod, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const roundTwo = (num: number) =>
    Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = roundTwo(
    items.reduce((a, c) => a + c.product.price * c.qty, 0),
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = roundTwo(itemsPrice * 0.15);
  const totalPrice = roundTwo(itemsPrice + shippingPrice + taxPrice);

  const placeOrderHandler = async () => {
    closeSnackbar();

    try {
      setLoading(true);

      if (!paymentMethod || !shippingAddress) return;

      const order = await orderService.saveOrder({
        itemsPrice,
        orderItems: items.map(({ product, qty }) => ({
          image: product.image,
          name: product.name,
          price: product.price,
          slug: product.slug,
          qty,
        })),
        paymentMethod,
        shippingAddress,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      clearCart();

      router.push(`/order/${order._id}`);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageTitle="Placeorder">
      <CheckOutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress && (
                  <Typography>
                    {shippingAddress.fullName}, {shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country}
                  </Typography>
                )}
              </ListItem>
            </List>
          </Card>
          <Card className={section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>{paymentMethod}</Typography>
              </ListItem>
            </List>
          </Card>
          <Card className={section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map(({ product, qty }) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <NextLink
                              href={`/product/${product.slug}`}
                              passHref
                            >
                              <Link>
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink
                              href={`/product/${product.slug}`}
                              passHref
                            >
                              <Link>
                                <Typography>{product.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{qty}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>${product.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total: </strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN, CART_ITEMS, SHIPPING_ADDRESS, PAYMENT_METHOD } =
    nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: '/login?redirect=shipping',
        permanent: true,
      },
    };
  }

  if (!CART_ITEMS) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  if (!SHIPPING_ADDRESS) {
    return {
      redirect: {
        destination: '/shipping',
        permanent: true,
      },
    };
  }

  if (!PAYMENT_METHOD) {
    return {
      redirect: {
        destination: '/payment',
        permanent: true,
      },
    };
  }

  const cartItems: CartItem[] = JSON.parse(CART_ITEMS);

  if (cartItems.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  try {
    const { isValid } = await userService.validateToken(USER_TOKEN);
    if (!isValid)
      return {
        redirect: { destination: '/login?redirect=shipping', permanent: true },
      };

    return {
      props: {},
    };
  } catch (err) {
    console.log(err.message);
    return {
      redirect: { destination: '/login?redirect=shipping', permanent: true },
    };
  }
};
