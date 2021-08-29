import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import Image from 'next/image';
import nookies from 'nookies';
import {
  Card,
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

import { Layout } from '../../components/Layout';
import { userService } from '../../data/services/user.service';
import { useStyles } from '../../styles/styles';
import { CheckOutWizard } from '../../components/CheckOutWizard';
import { getError } from '../../utils/error';
import { orderService } from '../../data/services/order.service';
import { Order } from '../../data/entities/order.entity';

type OrderDetailsProps = {
  order?: Order;
  error?: string;
};

export default function OrderDetails({ order, error }: OrderDetailsProps) {
  const { error: errorStyle, section } = useStyles();

  return (
    <Layout pageTitle={`Order ${order ? order._id : 'Not Found'}`}>
      <CheckOutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Order {order ? order._id : 'Not Found'}
      </Typography>

      {error ? (
        <Typography className={errorStyle}>{error}</Typography>
      ) : (
        <>
          {order && (
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
                      {order.shippingAddress && (
                        <Typography>
                          {order.shippingAddress.fullName},{' '}
                          {order.shippingAddress.address},{' '}
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.postalCode},{' '}
                          {order.shippingAddress.country}
                        </Typography>
                      )}
                    </ListItem>
                    <ListItem>
                      <Typography>Status:</Typography>
                      {order.isDelivered ? (
                        `delivered at ${order.deliveredAt?.toString()}`
                      ) : (
                        <Typography className={errorStyle}>
                          &nbsp;not delivered
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
                      <Typography>{order.paymentMethod}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography>Status:</Typography>
                      {order.isPaid ? (
                        `paid at {order.paidAt?.toString()}`
                      ) : (
                        <Typography className={errorStyle}>
                          &nbsp;not paid
                        </Typography>
                      )}
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
                            {order.orderItems.map(
                              (
                                { _id, image, name, price, qty, slug },
                                index,
                              ) => (
                                <TableRow key={_id || index}>
                                  <TableCell>
                                    <NextLink
                                      href={`/product/${slug}`}
                                      passHref
                                    >
                                      <Link>
                                        <Image
                                          src={image}
                                          alt={name}
                                          width={50}
                                          height={50}
                                        />
                                      </Link>
                                    </NextLink>
                                  </TableCell>
                                  <TableCell>
                                    <NextLink
                                      href={`/product/${slug}`}
                                      passHref
                                    >
                                      <Link>
                                        <Typography>{name}</Typography>
                                      </Link>
                                    </NextLink>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography>{qty}</Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography>${price}</Typography>
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
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
                          <Typography align="right">
                            ${order.itemsPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Tax: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            ${order.taxPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Shipping: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            ${order.shippingPrice}
                          </Typography>
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
                            <strong>${order.totalPrice}</strong>
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);

  if (!ctx.params || !ctx.params.id) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const { id } = ctx.params as { id: string };

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=order/${id}`,
        permanent: true,
      },
    };
  }

  try {
    const { isValid } = await userService.validateToken(USER_TOKEN);
    if (!isValid)
      return {
        redirect: {
          destination: `/login?redirect=order/${id}`,
          permanent: true,
        },
      };

    const order = await orderService.getUserOrder(id, USER_TOKEN);

    return {
      props: { order },
    };
  } catch (err) {
    console.log(err.message);
    return {
      props: { error: getError(err) },
    };
  }
};
