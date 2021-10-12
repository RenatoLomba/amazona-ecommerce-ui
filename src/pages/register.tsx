import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../components/layout';
import { useUser } from '../hooks/useUser';
import { useStyles } from '../styles/styles';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { userService } from '../data/services/user.service';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

type FormInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();
  const { form } = useStyles();
  const { loginUser } = useUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [error, setError] = useState('');

  const { redirect } = router.query;

  const formSubmitHandler: SubmitHandler<FormInput> = async ({
    name,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords did not match');
      }
      const authInfo = await userService.register({ email, name, password });
      loginUser(authInfo.user, authInfo.token);

      router.push(redirect ? `/${redirect}` : '/');
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setError('');
    }
  }, [error, enqueueSnackbar]);

  return (
    <Layout pageTitle="Register">
      <form className={form} onSubmit={handleSubmit(formSubmitHandler)}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'required'
                        ? 'Name is required'
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
            <Controller
              name="confirmPassword"
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
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength' ||
                        errors.confirmPassword.type === 'maxLength'
                        ? 'Confirm Password must have 8-16 characters'
                        : 'Confirm Password is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <NextLink
              href={redirect ? `/login?redirect=${redirect}` : `/login`}
              passHref
            >
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
