import { z } from 'zod';

export const createReceiverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
});

export const updateReceiverSchema = createReceiverSchema.partial();

export type CreateReceiverFormData = z.infer<typeof createReceiverSchema>;
export type UpdateReceiverFormData = z.infer<typeof updateReceiverSchema>;
