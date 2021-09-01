import React, { FormEvent, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';

import { Layout } from '../components/Layout';
import { CartItem } from '../data/entities/cart-item.entity';
import { userService } from '../data/services/user.service';
import { CheckOutWizard } from '../components/CheckOutWizard';
import { useStyles } from '../styles/styles';
import { useSnackbar } from 'notistack';
import { useCart } from '../hooks/useCart';
import { useEffect } from 'react';

export default function Payment() {
  const router = useRouter();
  const { form } = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { paymentMethod: storedPayment, savePaymentMethod } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('');

  const handleFormSubmit = (e: FormEvent) => {
    closeSnackbar();
    e.preventDefault();

    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
      return;
    }

    savePaymentMethod(paymentMethod);
    router.push('/placeorder');
  };

  useEffect(() => {
    if (!storedPayment) return;
    setPaymentMethod(storedPayment);
  }, [storedPayment]);

  return (
    <Layout pageTitle="Payment Method">
      <CheckOutWizard activeStep={2} />
      <form className={form} onSubmit={handleFormSubmit}>
        <Typography variant="h1" component="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN, CART_ITEMS, SHIPPING_ADDRESS } = nookies.get(ctx);

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
