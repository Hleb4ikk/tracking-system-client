import apiClient from './client';
import { User } from '../types';

export const userApi = {
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>('/users/me');
    return response.data;
  },
};
