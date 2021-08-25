import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Layout } from '../components/Layout';
import { useStyles } from '../styles/styles';
import { useRouter } from 'next/router';
import { userService } from '../data/services/user.service';
import { useUser } from '../hooks/useUser';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

type FormInput = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const { form } = useStyles();
  const { loggedUser, loginUser } = useUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [error, setError] = useState('');

  const { redirect } = router.query;

  const formSubmitHandler: SubmitHandler<FormInput> = async ({
    email,
    password,
  }) => {
    closeSnackbar();
    try {
      const authInfo = await userService.login(email, password);
      loginUser(authInfo.user, authInfo.token);

      router.push(redirect ? `/${redirect}` : '/');
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (loggedUser) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setError('');
    }
  }, [error, enqueueSnackbar]);

  return (
    <Layout pageTitle="Login">
      <form className={form} onSubmit={handleSubmit(formSubmitHandler)}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
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
                        : 'Email is required'
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
                required: true,
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
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don&apos;t have an account? &nbsp;
            <NextLink
              href={redirect ? `/register?redirect=${redirect}` : `/register`}
              passHref
            >
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
