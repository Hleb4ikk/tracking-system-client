import apiClient from './client';
import { SupplyNode, CreateSupplyNodeDto, UpdateSupplyNodeDto, SupplyNodeFilters } from '../types';

export const supplyNodesApi = {
  getSupplyNodes: async (page: number = 1, filters?: SupplyNodeFilters): Promise<SupplyNode[]> => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters?.title) params.append('title', filters.title);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.region) params.append('region', filters.region);

    const response = await apiClient.get<SupplyNode[]>(`/supply-nodes?${params.toString()}`);
    return response.data;
  },

  createSupplyNode: async (data: CreateSupplyNodeDto): Promise<{ message: string; supplyNode: SupplyNode }> => {
    const response = await apiClient.post<{ message: string; supplyNode: SupplyNode }>(
      '/supply-nodes',
      data
    );
    return response.data;
  },

  updateSupplyNode: async (
    id: string,
    data: UpdateSupplyNodeDto
  ): Promise<{ message: string; updatedFields: Partial<SupplyNode> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<SupplyNode> }>(
      `/supply-nodes/${id}`,
      data
    );
    return response.data;
  },

  deleteSupplyNode: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/supply-nodes/${id}`);
    return response.data;
  },
};
