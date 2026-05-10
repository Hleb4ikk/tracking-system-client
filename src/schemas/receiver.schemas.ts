import { z } from 'zod';

export const createReceiverSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  surname: z.string().min(1, 'Surname is required').max(100, 'Surname is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164)'),
});

export const updateReceiverSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  surname: z.string().min(1, 'Surname is required').max(100, 'Surname is too long').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(1, 'Phone is required').regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164)').optional(),
});

export type CreateReceiverFormData = z.infer<typeof createReceiverSchema>;
export type UpdateReceiverFormData = z.infer<typeof updateReceiverSchema>;
