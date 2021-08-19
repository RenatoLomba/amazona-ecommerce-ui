import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';

import { Layout } from '../../components/Layout';
import { Product } from '../../data/entities/product.entity';
import { productService } from '../../data/services/product.service';
import { useStyles } from '../../styles/styles';
import { useCart } from '../../hooks/useCart';
import { useRouter } from 'next/dist/client/router';

type ProductDetailsProps = {
  product: Product;
  error?: string;
};

export default function ProductDetails({
  product,
  error,
}: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { section } = useStyles();

  return (
    <Layout pageTitle={error || product.name} description={product.description}>
      <>
        <div className={section}>
          <NextLink href="/" passHref>
            <Link>
              <Typography>back to products</Typography>
            </Link>
          </NextLink>
        </div>
        {error ? (
          <div>
            <Typography>{error}</Typography>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Image
                src={product.image}
                alt={product.name}
                width={640}
                height={640}
                layout="responsive"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Category: {product.category}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>Brand: {product.brand}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>
                    Rating: {product.rating} stars ({product.numReviews}{' '}
                    reviews)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Description: {product.description}</Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>${product.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        addToCart(product, 1);
                        router.push('/cart');
                      }}
                    >
                      Add to cart
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

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await productService.products();

  const paths = products.map((product) => {
    return {
      params: { slug: product.slug },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const params = ctx.params;
  if (!params) {
    return { redirect: { statusCode: 400, destination: '/', permanent: true } };
  }

  try {
    const product = await productService.product(String(params.slug));
    return {
      props: { product },
    };
  } catch (error) {
    return {
      props: { error: error.message },
    };
  }
};
