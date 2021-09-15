import React, { useEffect, useState } from 'react';
import { requestHelper } from '../../utils/request-helper';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';
import { DashboardCard } from './dashboard-card';

const SalesCard = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [ordersPrice, setOrdersPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const fetchData = async () => {
    closeSnackbar();
    setIsLoading(true);
    setError(false);

    try {
      const result = await requestHelper<{ orders: { total: number } }>({
        route: 'orders/admin/total',
        isAuthenticated: true,
      });
      setOrdersPrice(result.orders.total);
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
      href="/admin/orders"
      title="Sales"
      value={currencyFormatter.format(ordersPrice)}
      error={error}
      isLoading={isLoading}
    />
  );
};

export { SalesCard };
