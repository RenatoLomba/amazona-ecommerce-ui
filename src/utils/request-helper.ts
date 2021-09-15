import nookies from 'nookies';
import { API_URL } from './constants';

type RequestHeaders = { 'Content-Type': string; Authorization?: string };
type RequestOptions = {
  headers?: RequestHeaders;
  method?: string;
  body?: string;
};

type RequestHelperProps = {
  route: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isAuthenticated?: boolean;
  body?: Record<string, string>;
};

const requestHelper = async <T>({
  route,
  body,
  isAuthenticated = false,
  method = 'GET',
}: RequestHelperProps): Promise<T> => {
  const options: RequestOptions = { method };
  const headers: RequestHeaders = {
    'Content-Type': 'application/json',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (isAuthenticated) {
    const { USER_TOKEN } = nookies.get(null);

    if (!USER_TOKEN) throw new Error('Unauthorized request');

    headers.Authorization = 'Bearer ' + USER_TOKEN;
  }

  options.headers = headers;

  const res = await fetch(`${API_URL}/${route}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export { requestHelper };
