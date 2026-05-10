import apiClient from './client';
import { Cargo, CreateCargoDto, UpdateCargoDto, CargoFilters } from '../types';

export const cargosApi = {
  getCargos: async (page: number = 1, filters?: CargoFilters): Promise<Cargo[]> => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters?.orderId) params.append('orderId', filters.orderId);
    if (filters?.responsibleId) params.append('responsibleId', filters.responsibleId);
    if (filters?.supplyNodeConnectionId) params.append('supplyNodeConnectionId', filters.supplyNodeConnectionId);

    const response = await apiClient.get<Cargo[]>(`/cargos?${params.toString()}`);
    return response.data;
  },

  // Get cargo count by connection ID
  getCargoCountByConnection: async (connectionId: string): Promise<number> => {
    const cargos = await cargosApi.getCargos(1, { supplyNodeConnectionId: connectionId });
    return cargos.length;
  },

  createCargo: async (data: CreateCargoDto): Promise<{ message: string; cargo: Cargo }> => {
    const response = await apiClient.post<{ message: string; cargo: Cargo }>('/cargos', data);
    return response.data;
  },

  updateCargo: async (
    id: string,
    data: UpdateCargoDto
  ): Promise<{ message: string; updatedFields: Partial<Cargo> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<Cargo> }>(
      `/cargos/${id}`,
      data
    );
    return response.data;
  },

  deleteCargo: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/cargos/${id}`);
    return response.data;
  },
};
