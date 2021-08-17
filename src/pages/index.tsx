import React, { useState } from 'react';
import { GetStaticProps } from 'next';
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

type HomeProps = {
  products: Product[];
  error?: string;
};

export default function Home({ products, error }: HomeProps) {
  const [productsList] = useState(products);

  return (
    <Layout pageTitle="See our products">
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {productsList.map((product) => (
            <Grid item md={4} key={product._id}>
              <Card>
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
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size="small" color="primary">
                    Add to cart
                  </Button>
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
      props: { error: error.response.data.message },
    };
  }
};
