import React from 'react';
import nookies from 'nookies';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';

import { Layout } from '../../components/layout';
import { userService } from '../../data/services/user.service';
import { orderService } from '../../data/services/order.service';
import { Order } from '../../data/entities/order.entity';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useStyles } from '../../styles/styles';
import { format } from 'date-fns';

type OrderHistoryProps = {
  orders: Order[];
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const { section, error: errorStyle } = useStyles();
  console.log(orders);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Layout pageTitle="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile" />
                </ListItem>
              </NextLink>
              <NextLink href="/order" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Order History" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>TOTAL</TableCell>
                        <TableCell>PAID</TableCell>
                        <TableCell>DELIVERED</TableCell>
                        <TableCell>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.length > 0 &&
                        orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>
                              {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>
                              {currencyFormatter.format(order.totalPrice)}
                            </TableCell>
                            <TableCell>
                              {order.isPaid && order.paidAt ? (
                                <Typography>
                                  &nbsp;paid at{' '}
                                  {format(
                                    new Date(order.paidAt),
                                    'MM/dd/yyyy HH:mm',
                                  )}
                                </Typography>
                              ) : (
                                <Typography className={errorStyle}>
                                  &nbsp;not paid
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered && order.deliveredAt ? (
                                <Typography>
                                  &nbsp;delivered at{' '}
                                  {format(
                                    new Date(order.deliveredAt),
                                    'MM/dd/yyyy HH:mm',
                                  )}
                                </Typography>
                              ) : (
                                <Typography className={errorStyle}>
                                  &nbsp;not delivered
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
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
      </Grid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: '/login?redirect=order',
        permanent: true,
      },
    };
  }

  try {
    const { isValid } = await userService.validateToken(USER_TOKEN);
    if (!isValid)
      return {
        redirect: { destination: '/login?redirect=order', permanent: true },
      };

    const orders = await orderService.getOrders(USER_TOKEN);

    return {
      props: { orders },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: { destination: '/login?redirect=order', permanent: true },
    };
  }
};
