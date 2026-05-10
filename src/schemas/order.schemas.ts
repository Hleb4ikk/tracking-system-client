import { z } from 'zod';

export const createOrderSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  status: z.string().min(1, 'Status is required'),
  description: z.string().optional(),
  responsibleId: z.string().uuid('Invalid responsible ID'),
  recieverId: z.string().uuid('Invalid receiver ID'),
});

export const updateOrderSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  status: z.string().min(1, 'Status is required').optional(),
  description: z.string().optional(),
  responsibleId: z.string().uuid('Invalid responsible ID').optional(),
  recieverId: z.string().uuid('Invalid receiver ID').optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
