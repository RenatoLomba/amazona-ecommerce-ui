import React from 'react';
import type { NextPage } from 'next';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout pageTitle="See our products">
      <div>
        <h1>Products</h1>
        <ul>
          <li>Product 1</li>
          <li>Product 2</li>
          <li>Product 3</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Home;
