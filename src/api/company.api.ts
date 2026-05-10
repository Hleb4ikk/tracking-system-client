import apiClient from './client';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../types';

export const companyApi = {
  getCompanies: async (page: number = 1): Promise<Company[]> => {
    const response = await apiClient.get<Company[]>(`/companies?page=${page}`);
    return response.data;
  },

  getCompanyById: async (id: string): Promise<{ company: Company }> => {
    const response = await apiClient.get<{ company: Company }>(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (
    data: CreateCompanyDto
  ): Promise<{ message: string; company: Company }> => {
    const response = await apiClient.post<{ message: string; company: Company }>(
      '/companies',
      data
    );
    return response.data;
  },

  updateCompany: async (
    id: string,
    data: UpdateCompanyDto
  ): Promise<{ message: string; updatedFields: Partial<Company> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<Company> }>(
      `/companies/${id}`,
      data
    );
    return response.data;
  },

  deleteCompany: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/companies/${id}`);
    return response.data;
  },
};
