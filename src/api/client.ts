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
    // Можно добавить логирование или другую логику
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Обработка ошибок
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        statusCode: error.response.status,
        error: error.response.data?.error,
      };

      // Если 401 - перенаправляем на login
      if (error.response.status === 401) {
        // Очищаем состояние и редиректим
        window.location.href = '/login';
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      const apiError: ApiError = {
        message: 'No response from server',
        statusCode: 0,
      };
      return Promise.reject(apiError);
    } else {
      // Ошибка при настройке запроса
      const apiError: ApiError = {
        message: error.message || 'Request setup error',
        statusCode: 0,
      };
      return Promise.reject(apiError);
    }
  }
);

export default apiClient;
