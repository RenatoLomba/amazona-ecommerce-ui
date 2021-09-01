import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';

import { Layout } from '../components/Layout';
import { userService } from '../data/services/user.service';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { useStyles } from '../styles/styles';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { useUser } from '../hooks/useUser';

type FormInput = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function OrderHistory() {
  const { section, form, fullWidth } = useStyles();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormInput>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { loginUser, loggedUser } = useUser();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formSubmitHandler: SubmitHandler<FormInput> = async ({
    name,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();
    setLoading(true);

    try {
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          throw new Error('Passwords did not match');
        }
      }
      const authInfo = await userService.update({ email, name, password });

      loginUser(authInfo.user, authInfo.token);

      enqueueSnackbar('Success updating User', { variant: 'success' });
    } catch (err) {
      console.log(err);
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setError('');
    }
  }, [error, enqueueSnackbar]);

  useEffect(() => {
    if (loggedUser) {
      setValue('email', loggedUser.email);
      setValue('name', loggedUser.name);
    }
  }, [loggedUser, setValue]);

  return (
    <Layout pageTitle="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile" />
                </ListItem>
              </NextLink>
              <NextLink href="/order" passHref>
                <ListItem button component="a">
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
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  className={`${form} ${fullWidth}`}
                  onSubmit={handleSubmit(formSubmitHandler)}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            type="email"
                            error={Boolean(errors.email)}
                            helperText={
                              errors.email
                                ? errors.email.type === 'pattern'
                                  ? 'Email is not valid'
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
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          maxLength: 16,
                          minLength: 8,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            type="password"
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password
                                ? errors.password.type === 'minLength' ||
                                  errors.password.type === 'maxLength'
                                  ? 'Password must have 8-16 characters'
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
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          maxLength: 16,
                          minLength: 8,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.confirmPassword
                                ? errors.confirmPassword.type === 'minLength' ||
                                  errors.confirmPassword.type === 'maxLength'
                                  ? 'Confirm Password must have 8-16 characters'
                                  : ''
                                : ''
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    {loading && (
                      <ListItem>
                        <CircularProgress />
                      </ListItem>
                    )}
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
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
        destination: '/login?redirect=profile',
        permanent: true,
      },
    };
  }

  try {
    const { isValid } = await userService.validateToken(USER_TOKEN);
    if (!isValid)
      return {
        redirect: { destination: '/login?redirect=profile', permanent: true },
      };

    return {
      props: {},
    };
  } catch (err) {
    console.log(err.message);
    return {
      redirect: { destination: '/login?redirect=profile', permanent: true },
    };
  }
};
