import { z } from 'zod';

export const createOrderSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  status: z.string().min(1, 'Status is required'),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  responsibleId: z.string().uuid('Invalid responsible user ID'),
  recieverId: z.string().uuid('Invalid receiver ID'),
});

export const updateOrderSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  status: z.string().min(1, 'Status is required').optional(),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  responsibleId: z.string().uuid('Invalid responsible user ID').optional(),
  recieverId: z.string().uuid('Invalid receiver ID').optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
