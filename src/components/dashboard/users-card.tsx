import React, { useEffect, useState } from 'react';
import { requestHelper } from '../../utils/request-helper';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';
import { DashboardCard } from './dashboard-card';

const UsersCard = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [usersCount, setUsersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    closeSnackbar();
    setIsLoading(true);
    setError(false);

    try {
      const result = await requestHelper<{ users: { count: number } }>({
        route: 'users/admin/count',
        isAuthenticated: true,
      });
      setUsersCount(result.users.count);
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
      href="/admin/users"
      title="Users"
      value={String(usersCount)}
      error={error}
      isLoading={isLoading}
    />
  );
};

export { UsersCard };
