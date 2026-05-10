import apiClient from './client';

export interface DashboardStats {
  totalOrders: number;
  activeCargos: number;
  totalVehicles: number;
  availableVehicles: number;
  ordersGrowth: number;
  cargosGrowth: number;
}

export interface RecentOrder {
  id: string;
  title: string;
  status: string;
  description: string | null;
  receiver_name: string;
  receiver_surname: string;
}

export interface ActiveCargo {
  id: string;
  title: string;
  status: string;
  description: string;
  vehicle_title: string | null;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const response = await apiClient.get<RecentOrder[]>('/dashboard/recent-orders');
    return response.data;
  },

  getActiveCargos: async (): Promise<ActiveCargo[]> => {
    const response = await apiClient.get<ActiveCargo[]>('/dashboard/active-cargos');
    return response.data;
  },
};
