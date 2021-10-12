import React, { useEffect, useState } from 'react';
import { requestHelper } from '../../utils/request-helper';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';
import { DashboardCard } from './dashboard-card';

const OrdersCard = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [ordersCount, setOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    closeSnackbar();
    setIsLoading(true);
    setError(false);

    try {
      const result = await requestHelper<{ orders: { count: number } }>({
        route: 'orders/admin/count',
        isAuthenticated: true,
      });
      setOrdersCount(result.orders.count);
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
      title="Orders"
      value={String(ordersCount)}
      error={error}
      isLoading={isLoading}
    />
  );
};

export { OrdersCard };
