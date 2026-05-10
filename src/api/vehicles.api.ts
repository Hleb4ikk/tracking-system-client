import apiClient from './client';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../types';

export const vehiclesApi = {
  getVehicles: async (page: number = 1): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>(`/vehicles?page=${page}`);
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
