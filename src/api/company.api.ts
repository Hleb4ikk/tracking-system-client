import apiClient from './client';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../types';

export const companyApi = {
  // Get user's company
  getUserCompany: async (): Promise<{ company: Company }> => {
    const response = await apiClient.get<{ company: Company }>('/companies');
    return response.data;
  },

  // Create a new company
  createCompany: async (
    data: CreateCompanyDto
  ): Promise<{ message: string; company: Company }> => {
    const response = await apiClient.post<{ message: string; company: Company }>(
      '/companies',
      data
    );

    return response.data;
  },

  // Update company (only co-founder)
  updateCompany: async (
    data: UpdateCompanyDto
  ): Promise<{ message: string; updatedFields: Partial<Company> }> => {
    const response = await apiClient.patch<{ message: string; updatedFields: Partial<Company> }>(
      '/companies',
      data
    );
    return response.data;
  },

  // Delete company (only co-founder)
  deleteCompany: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>('/companies');
    return response.data;
  },
};
