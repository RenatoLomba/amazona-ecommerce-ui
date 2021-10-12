import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import {
  Button,
  Card,
  CircularProgress,
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
import { Layout } from '../../components/layout';
import { getError } from '../../utils/error';
import { userService } from '../../data/services/user.service';
import { format } from 'date-fns';
import { useStyles } from '../../styles/styles';
import { Order } from '../../data/entities/order.entity';
import { useSnackbar } from 'notistack';
import { requestHelper } from '../../utils/request-helper';
import { currencyFormatter } from '../../utils/currency-formatter';

const Orders: NextPage = () => {
  const { section } = useStyles();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchOrders = async () => {
    closeSnackbar();
    setError(false);
    setLoading(true);

    try {
      const orders = await requestHelper<Order[]>({
        route: 'orders/admin/all',
        isAuthenticated: true,
      });
      setOrders(orders);
    } catch (err) {
      setError(true);
      enqueueSnackbar(getError(err), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Layout pageTitle="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders" />
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
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Button
                    onClick={fetchOrders}
                    variant="contained"
                    color="primary"
                  >
                    Refresh
                  </Button>
                ) : (
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
                              <TableCell>
                                {order._id.substring(20, 24)}
                              </TableCell>
                              <TableCell>
                                {format(
                                  new Date(order.createdAt),
                                  'dd/MM/yyyy',
                                )}
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
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: '/login?redirect=admin/orders',
        permanent: true,
      },
    };
  }

  try {
    const {
      isValid,
      user: { isAdmin },
    } = await userService.validateToken(USER_TOKEN);
    if (!isValid)
      return {
        redirect: {
          destination: '/login?redirect=admin/orders',
          permanent: true,
        },
      };

    if (!isAdmin) {
      return {
        redirect: { destination: '/', permanent: true },
      };
    }

    return {
      props: {},
    };
  } catch (err) {
    console.log(getError(err));
    return {
      redirect: {
        destination: '/login?redirect=admin/orders',
        permanent: true,
      },
    };
  }
};

export { getServerSideProps };
export default Orders;
