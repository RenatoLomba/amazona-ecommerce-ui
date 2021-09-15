import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import React, { FC } from 'react';
import NextLink from 'next/link';

type DashboardCardProps = {
  value: string;
  title: string;
  fetchData: () => void;
  href: string;
  error?: boolean;
  isLoading?: boolean;
};

const DashboardCard: FC<DashboardCardProps> = ({
  value,
  title,
  fetchData,
  href,
  error = false,
  isLoading = false,
}) => {
  return (
    <Card raised>
      <CardContent>
        <Typography variant="h1">
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Button onClick={fetchData} variant="contained" color="primary">
              Refresh
            </Button>
          ) : (
            value
          )}
        </Typography>
        <Typography>{title}</Typography>
      </CardContent>
      <CardActions>
        <NextLink href={href} passHref>
          <Button size="small" color="primary">
            View {title.toLowerCase()}
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export { DashboardCard };
