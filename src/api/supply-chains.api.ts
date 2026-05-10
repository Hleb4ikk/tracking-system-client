import apiClient from './client';
import type {
  SupplyChain,
  SupplyChainWithGraph,
  CreateSupplyChainDto,
  UpdateSupplyChainDto,
  SupplyChainFilters,
} from '../types/supply-chain.types';
import {parse} from "flatted"
export const supplyChainsApi = {
  // Get all supply chains with filters
  getSupplyChains: async (
    page: number = 1,
    filters?: SupplyChainFilters
  ): Promise<SupplyChain[]> => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters?.title) {
      params.append('title', filters.title);
    }
    if (filters?.companyId) {
      params.append('companyId', filters.companyId);
    }

    const response = await apiClient.get<SupplyChain[]>(
      `/supply-chains?${params.toString()}`
    );
    return response.data;
  },

  // Get supply chain by ID with graph
  getSupplyChainById: async (id: string): Promise<SupplyChainWithGraph> => {
    const response = await apiClient.get(`/supply-chains/${id}`);
    console.log(parse(JSON.stringify(response.data)))
    return parse(JSON.stringify(response.data)) as SupplyChainWithGraph;
  },

  // Create new supply chain
  createSupplyChain: async (
    data: CreateSupplyChainDto
  ): Promise<{ message: string; supplyChain: SupplyChainWithGraph }> => {
    const response = await apiClient.post<{
      message: string;
      supplyChain: SupplyChainWithGraph;
    }>('/supply-chains', data);
    return response.data;
  },

  // Update supply chain
  updateSupplyChain: async (
    id: string,
    data: UpdateSupplyChainDto
  ): Promise<{ message: string; updatedFields: Partial<SupplyChainWithGraph> }> => {
    const response = await apiClient.patch<{
      message: string;
      updatedFields: Partial<SupplyChainWithGraph>;
    }>(`/supply-chains/${id}`, data);
    return response.data;
  },

  // Delete supply chain
  deleteSupplyChain: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/supply-chains/${id}`
    );
    return response.data;
  },
};
