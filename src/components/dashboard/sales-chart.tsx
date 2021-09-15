import { Button, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getError } from '../../utils/error';
import { requestHelper } from '../../utils/request-helper';

type SalesData = { _id: string; totalSales: number };

const SalesChart = () => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSalesData = async () => {
    closeSnackbar();
    setLoading(true);
    setError(false);

    try {
      const salesDataFetched = await requestHelper<{
        orders: { salesData: SalesData[] };
      }>({
        route: 'orders/admin/sales',
        isAuthenticated: true,
      });
      setSalesData(salesDataFetched.orders.salesData);
    } catch (err) {
      enqueueSnackbar(getError(err));
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  } else if (error) {
    return (
      <Button onClick={fetchSalesData} variant="contained" color="primary">
        Refresh
      </Button>
    );
  } else if (salesData.length > 0) {
    return (
      <Bar
        data={{
          labels: salesData.map((x) => x._id),
          datasets: [
            {
              label: 'Sales',
              backgroundColor: 'rgba(162,222,208, 1)',
              data: salesData.map((x) => x.totalSales),
            },
          ],
        }}
        options={{ legend: { display: true, position: 'right' } }}
      />
    );
  } else {
    return <CircularProgress />;
  }
};

export { SalesChart };
