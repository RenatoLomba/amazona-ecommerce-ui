import React, { useEffect, useState } from 'react';
import { requestHelper } from '../../utils/request-helper';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';
import { DashboardCard } from './dashboard-card';

const ProductsCard = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [productsCount, setProductsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    closeSnackbar();
    setIsLoading(true);
    setError(false);

    try {
      const result = await requestHelper<{ products: { count: number } }>({
        route: 'products/admin/count',
        isAuthenticated: true,
      });
      setProductsCount(result.products.count);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardCard
      fetchData={fetchData}
      href="/admin/products"
      title="Products"
      value={String(productsCount)}
      error={error}
      isLoading={isLoading}
    />
  );
};

export { ProductsCard };
