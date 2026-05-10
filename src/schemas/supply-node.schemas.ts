import { z } from 'zod';

export const createSupplyNodeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional().nullable(),
  country: z.string().min(2, 'Country is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  region: z.string().min(2, 'Region is required'),
  city: z.string().min(2, 'City is required'),
  address_line: z.string().min(5, 'Address must be at least 5 characters'),  // snake_case to match backend
});

export const updateSupplyNodeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().optional().nullable(),
  country: z.string().min(2, 'Country is required').optional(),
  zip: z.string().min(3, 'ZIP code is required').optional(),
  region: z.string().min(2, 'Region is required').optional(),
  city: z.string().min(2, 'City is required').optional(),
  address_line: z.string().min(5, 'Address must be at least 5 characters').optional(),  // snake_case to match backend
});

export type CreateSupplyNodeFormData = z.infer<typeof createSupplyNodeSchema>;
export type UpdateSupplyNodeFormData = z.infer<typeof updateSupplyNodeSchema>;
