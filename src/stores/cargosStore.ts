import { create } from 'zustand';
import { Cargo, CreateCargoDto, UpdateCargoDto, CargoFilters } from '../types';
import { cargosApi } from '../api';

interface CargosState {
  cargos: Cargo[];
  filters: CargoFilters;
  currentPage: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCargos: (page?: number, filters?: CargoFilters) => Promise<void>;
  createCargo: (data: CreateCargoDto) => Promise<Cargo>;
  updateCargo: (id: string, data: UpdateCargoDto) => Promise<void>;
  deleteCargo: (id: string) => Promise<void>;
  setFilters: (filters: CargoFilters) => void;
  clearError: () => void;
}

export const useCargosStore = create<CargosState>((set, get) => ({
  cargos: [],
  filters: {},
  currentPage: 1,
  isLoading: false,
  error: null,

  fetchCargos: async (page = 1, filters) => {
    set({ isLoading: true, error: null });
    try {
      const finalFilters = filters || get().filters;
      const cargos = await cargosApi.getCargos(page, finalFilters);
      set({
        cargos,
        currentPage: page,
        filters: finalFilters,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch cargos',
        isLoading: false,
      });
    }
  },

  createCargo: async (data: CreateCargoDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cargosApi.createCargo(data);
      set({ isLoading: false });
      await get().fetchCargos(get().currentPage, get().filters);
      return response.cargo;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create cargo',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCargo: async (id: string, data: UpdateCargoDto) => {
    set({ isLoading: true, error: null });
    try {
      await cargosApi.updateCargo(id, data);
      set({ isLoading: false });
      await get().fetchCargos(get().currentPage, get().filters);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update cargo',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCargo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await cargosApi.deleteCargo(id);
      set({ isLoading: false });
      await get().fetchCargos(get().currentPage, get().filters);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete cargo',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: CargoFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));
