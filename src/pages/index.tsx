import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';

import { Layout } from '../components/Layout';
import { productService } from '../data/services/product.service';
import { Product } from '../data/entities/product.entity';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/dist/client/router';

type HomeProps = {
  products: Product[];
  error?: string;
};

export default function Home({ products }: HomeProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [productsList] = useState(products);

  return (
    <Layout pageTitle="See our products">
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {productsList.map((product) => (
            <Grid item md={4} key={product._id}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  {product.countInStock > 0 ? (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        addToCart(product, 1);
                        router.push('/cart');
                      }}
                    >
                      Add to cart
                    </Button>
                  ) : (
                    <Typography color="error">Out of stock</Typography>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const products = await productService.products();
    return {
      props: { products },
      revalidate: 60 * 5,
    };
  } catch (error) {
    return {
      props: { error: error.message },
    };
  }
};
