import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/backend-api',
  timeout: 30000,
});

let refreshPromise = null;

function requestRefreshToken() {
  if (!refreshPromise) {
    const refreshToken = Cookies.get('refreshToken');

    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token'));
    }

    const refreshBase = process.env.NEXT_PUBLIC_API_URL || '/backend-api';
    refreshPromise = axios
      .post(`${refreshBase}/auth/refresh`, { refreshToken })
      .then((response) => response.data?.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !String(originalRequest.url || '').includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const nextAccessToken = await requestRefreshToken();
        if (!nextAccessToken) {
          throw new Error('Refresh failed');
        }

        Cookies.set('accessToken', nextAccessToken, { expires: 1 / 96 });
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

        return api(originalRequest);
      } catch {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
