import apiClient from './client';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleFilters } from '../types';

export const vehiclesApi = {
  getVehicles: async (page: number = 1, filters?: VehicleFilters): Promise<Vehicle[]> => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters?.title) {
      params.append('title', filters.title);
    }
    if (filters?.deliveryType) {
      params.append('deliveryType', filters.deliveryType);
    }
    if (filters?.companyId) {
      params.append('companyId', filters.companyId);
    }

    const response = await apiClient.get<Vehicle[]>(`/vehicles?${params.toString()}`);
    return response.data;
  },

  getVehicleById: async (id: string): Promise<{ vehicle: Vehicle }> => {
    const response = await apiClient.get<{ vehicle: Vehicle }>(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: CreateVehicleDto): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await apiClient.post<{ message: string; vehicle: Vehicle }>('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (
    id: string,
    data: UpdateVehicleDto
  ): Promise<{ message: string; updatedFields: Partial<Vehicle> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<Vehicle> }>(
      `/vehicles/${id}`,
      data
    );
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/vehicles/${id}`);
    return response.data;
  },
};
