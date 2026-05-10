import apiClient from './client';
import { Receiver, CreateReceiverDto, UpdateReceiverDto, ReceiverFilters } from '../types';

export const receiversApi = {
  getReceivers: async (page: number = 1, filters?: ReceiverFilters): Promise<Receiver[]> => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters?.name) {
      params.append('name', filters.name);
    }
    if (filters?.surname) {
      params.append('surname', filters.surname);
    }
    if (filters?.email) {
      params.append('email', filters.email);
    }
    if (filters?.phone) {
      params.append('phone', filters.phone);
    }
    if (filters?.companyId) {
      params.append('companyId', filters.companyId);
    }

    const response = await apiClient.get<Receiver[]>(`/recievers?${params.toString()}`);
    return response.data;
  },

  getReceiverById: async (id: string): Promise<{ reciever: Receiver }> => {
    const response = await apiClient.get<{ reciever: Receiver }>(`/recievers/${id}`);
    return response.data;
  },

  createReceiver: async (
    data: CreateReceiverDto
  ): Promise<{ message: string; reciever: Receiver }> => {
    const response = await apiClient.post<{ message: string; reciever: Receiver }>(
      '/recievers',
      data
    );
    return response.data;
  },

  updateReceiver: async (
    id: string,
    data: UpdateReceiverDto
  ): Promise<{ message: string; updatedFields: Partial<Receiver> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<Receiver> }>(
      `/recievers/${id}`,
      data
    );
    return response.data;
  },

  deleteReceiver: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/recievers/${id}`);
    return response.data;
  },
};
