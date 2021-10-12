import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import nookies from 'nookies';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Layout } from '../components/layout';
import { useStyles } from '../styles/styles';
import { userService } from '../data/services/user.service';
import { CartItem } from '../data/entities/cart-item.entity';
import { useCart } from '../hooks/useCart';
import { useEffect } from 'react';
import { CheckOutWizard } from '../components/checkout-wizard';

type FormInput = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function Shipping() {
  const { form } = useStyles();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInput>();
  const { changeAddress, shippingAddress } = useCart();

  const formSubmitHandler: SubmitHandler<FormInput> = ({
    address,
    city,
    country,
    fullName,
    postalCode,
  }) => {
    changeAddress({ address, city, country, fullName, postalCode });
    router.push('/payment');
  };

  useEffect(() => {
    if (shippingAddress) {
      for (const prop in shippingAddress) {
        const field = prop as keyof FormInput;
        setValue(field, shippingAddress[field]);
      }
    }
  }, [shippingAddress, setValue]);

  return (
    <Layout pageTitle="Shipping Address">
      <CheckOutWizard activeStep={1} />
      <form className={form} onSubmit={handleSubmit(formSubmitHandler)}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'required'
                        ? 'Full Name is required'
                        : ''
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Address"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'required'
                        ? 'Address is required'
                        : ''
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="City"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'required'
                        ? 'City is required'
                        : ''
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'required'
                        ? 'Postal Code is required'
                        : ''
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="country"
                  label="Country"
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'required'
                        ? 'Country is required'
                        : ''
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN, CART_ITEMS } = nookies.get(ctx);

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
