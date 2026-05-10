import { create } from 'zustand';
import {
  Order,
  OrderWithHistory,
  OrderWithDetails,
  CreateOrderDto,
  UpdateOrderDto,
  OrderFilters,
} from '../types';
import { ordersApi } from '../api';

interface OrdersState {
  orders: OrderWithHistory[];
  currentOrder: OrderWithDetails | null;
  filters: OrderFilters;
  currentPage: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: (page?: number, filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (data: CreateOrderDto) => Promise<Order>;
  updateOrder: (id: string, data: UpdateOrderDto) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  setFilters: (filters: OrderFilters) => void;
  clearCurrentOrder: () => void;
  clearError: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  currentOrder: null,
  filters: {},
  currentPage: 1,
  isLoading: false,
  error: null,

  fetchOrders: async (page = 1, filters) => {
    set({ isLoading: true, error: null });
    try {
      const finalFilters = filters || get().filters;
      const orders = await ordersApi.getOrders(page, finalFilters);
      set({
        orders,
        currentPage: page,
        filters: finalFilters,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch orders',
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.getOrderById(id);
      set({
        currentOrder: response.order,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch order',
        isLoading: false,
      });
    }
  },

  createOrder: async (data: CreateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.createOrder(data);
      set({ isLoading: false });
      // Refresh orders list
      await get().fetchOrders(get().currentPage, get().filters);
      return response.order;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create order',
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrder: async (id: string, data: UpdateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.updateOrder(id, data);
      set({ isLoading: false });
      // Refresh current order if it's the one being updated
      if (get().currentOrder?.id === id) {
        await get().fetchOrderById(id);
      }
      // Refresh orders list
      await get().fetchOrders(get().currentPage, get().filters);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update order',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.deleteOrder(id);
      set({ isLoading: false });
      // Refresh orders list
      await get().fetchOrders(get().currentPage, get().filters);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete order',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: OrderFilters) => {
    set({ filters });
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
