import { z } from 'zod';

export const createReceiverSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  country: z.string().min(2, 'Country is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  region: z.string().min(2, 'Region is required'),
  city: z.string().min(2, 'City is required'),
  address_line: z.string().min(5, 'Address must be at least 5 characters'),
});

export const updateReceiverSchema = createReceiverSchema.partial();

export type CreateReceiverFormData = z.infer<typeof createReceiverSchema>;
export type UpdateReceiverFormData = z.infer<typeof updateReceiverSchema>;
