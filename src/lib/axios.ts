import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useAuthStore } from '@/store/authStore';

export const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('[HTTP 401] Unauthorized or token expired. Logging out.');
      useAuthStore.getState().logout();
    } else if (status === 403) {
      console.error('[HTTP 403] Access Forbidden.');
    } else if (status === 500) {
      console.error('[HTTP 500] Internal Server Error:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
