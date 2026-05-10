import { create } from 'zustand';
import { dashboardApi, DashboardStats, RecentOrder, ActiveCargo } from '../api/dashboard.api';

interface DashboardState {
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  activeCargos: ActiveCargo[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchRecentOrders: () => Promise<void>;
  fetchActiveCargos: () => Promise<void>;
  fetchAll: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  recentOrders: [],
  activeCargos: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await dashboardApi.getStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch stats',
        isLoading: false,
      });
    }
  },

  fetchRecentOrders: async () => {
    try {
      const recentOrders = await dashboardApi.getRecentOrders();
      set({ recentOrders });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch recent orders' });
    }
  },

  fetchActiveCargos: async () => {
    try {
      const activeCargos = await dashboardApi.getActiveCargos();
      set({ activeCargos });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch active cargos' });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [stats, recentOrders, activeCargos] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentOrders(),
        dashboardApi.getActiveCargos(),
      ]);
      set({
        stats,
        recentOrders,
        activeCargos,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
