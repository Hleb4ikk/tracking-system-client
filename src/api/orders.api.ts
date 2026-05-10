import apiClient from './client';
import {
  Order,
  OrderWithHistory,
  OrderWithDetails,
  CreateOrderDto,
  UpdateOrderDto,
  OrderFilters,
} from '../types';

export const ordersApi = {
  getOrders: async (
    page: number = 1,
    filters?: OrderFilters
  ): Promise<OrderWithHistory[]> => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters?.title) params.append('title', filters.title);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.responsibleId) params.append('responsibleId', filters.responsibleId);
    if (filters?.recieverId) params.append('recieverId', filters.recieverId);

    const response = await apiClient.get<OrderWithHistory[]>(`/orders?${params.toString()}`);
    return response.data;
  },

  getOrderById: async (id: string): Promise<{ order: OrderWithDetails }> => {
    const response = await apiClient.get<{ order: OrderWithDetails }>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderDto): Promise<{ message: string; order: Order }> => {
    const response = await apiClient.post<{ message: string; order: Order }>('/orders', data);
    return response.data;
  },

  updateOrder: async (
    id: string,
    data: UpdateOrderDto
  ): Promise<{ message: string; updatedFields: Partial<Order> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<Order> }>(
      `/orders/${id}`,
      data
    );
    return response.data;
  },

  deleteOrder: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/orders/${id}`);
    return response.data;
  },
};
