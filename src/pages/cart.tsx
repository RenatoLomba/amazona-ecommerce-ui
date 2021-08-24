import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Layout } from '../components/Layout';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/dist/client/router';

export default function Cart() {
  const router = useRouter();
  const { items, updateProductQty, deleteFromCart } = useCart();

  const checkOutHandler = () => {
    router.push(`/shipping`);
  };

  return (
    <Layout pageTitle="Your cart">
      <>
        <Typography component="h1" variant="h1">
          Shopping Cart
        </Typography>
        {items.length === 0 ? (
          <div>
            Cart is empty.{' '}
            <NextLink href="/" passHref>
              <Link>Go shopping</Link>
            </NextLink>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(({ product, qty }) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <NextLink href={`/product/${product.slug}`} passHref>
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
                          <NextLink href={`/product/${product.slug}`} passHref>
                            <Link>
                              <Typography>{product.name}</Typography>
                            </Link>
                          </NextLink>
                        </TableCell>
                        <TableCell align="right">
                          <Select
                            value={qty}
                            onChange={(e) =>
                              updateProductQty(
                                product._id,
                                Number(e.target.value),
                              )
                            }
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              ),
                            )}
                          </Select>
                        </TableCell>
                        <TableCell align="right">${product.price}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => deleteFromCart(product._id)}
                          >
                            x
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({items.reduce((a, c) => a + c.qty, 0)} items) :
                      $
                      {items
                        .reduce((a, c) => a + c.qty * c.product.price, 0)
                        .toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={checkOutHandler}
                    >
                      Check Out
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </>
    </Layout>
  );
}
