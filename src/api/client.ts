import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../constants';
import { ApiError } from '../types';

// Создаем экземпляр axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // Важно для отправки cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || error.response.data?.error || 'An error occurred',
        statusCode: error.response.status,
        error: error.response.data?.error || error.response.statusText,
      };
      if (error.response.status === 401 && !error.config?.url?.includes('/auth/login') && !window.location.href.includes("/login")) {
        window.location.href = '/login';
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      const apiError: ApiError = {
        message: 'No response from server. Please check your connection.',
        statusCode: 0,
      };
      return Promise.reject(apiError);
    } else {
      const apiError: ApiError = {
        message: error.message || 'Request setup error',
        statusCode: 0,
      };
      return Promise.reject(apiError);
    }
  }
);

export default apiClient;
