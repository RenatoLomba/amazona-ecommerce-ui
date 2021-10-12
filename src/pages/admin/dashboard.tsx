import React from 'react';
import nookies from 'nookies';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';

import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { useStyles } from '../../styles/styles';
import { SalesCard } from '../../components/dashboard/sales-card';
import { OrdersCard } from '../../components/dashboard/orders-card';
import { ProductsCard } from '../../components/dashboard/products-card';
import { UsersCard } from '../../components/dashboard/users-card';
import { userService } from '../../data/services/user.service';
import { getError } from '../../utils/error';
import { Layout } from '../../components/layout';
import { SalesChart } from '../../components/dashboard/sales-chart';

export default function AdminDashboard() {
  const { section } = useStyles();

  return (
    <Layout pageTitle="Admin Dashboard">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
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
                <Grid container spacing={5}>
                  <Grid item md={3}>
                    <SalesCard />
                  </Grid>
                  <Grid item md={3}>
                    <OrdersCard />
                  </Grid>
                  <Grid item md={3}>
                    <ProductsCard />
                  </Grid>
                  <Grid item md={3}>
                    <UsersCard />
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <SalesChart />
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
        destination: '/login?redirect=admin/dashboard',
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
          destination: '/login?redirect=admin/dashboard',
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
        destination: '/login?redirect=admin/dashboard',
        permanent: true,
      },
    };
  }
};
