import { z } from 'zod';
import { CARGO_STATUS } from '../constants';

export const createCargoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  supply_node_connection_id: z.string().uuid('Invalid supply node connection ID'),
  status: z.enum([
    CARGO_STATUS.ASSEMBLY,
    CARGO_STATUS.ON_THE_WAY,
    CARGO_STATUS.DELAYED,
    CARGO_STATUS.DELIVERED,
  ]),
  vehicle_id: z.string().uuid('Invalid vehicle ID').optional(),
  order_id: z.string().uuid('Invalid order ID').optional(),
  responsibleId: z.string().uuid('Invalid responsible ID'),
});

export const updateCargoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  supply_node_connection_id: z.string().uuid('Invalid supply node connection ID').optional(),
  status: z
    .enum([
      CARGO_STATUS.ASSEMBLY,
      CARGO_STATUS.ON_THE_WAY,
      CARGO_STATUS.DELAYED,
      CARGO_STATUS.DELIVERED,
    ])
    .optional(),
  vehicle_id: z.string().uuid('Invalid vehicle ID').optional(),
  order_id: z.string().uuid('Invalid order ID').optional(),
  responsibleId: z.string().uuid('Invalid responsible ID').optional(),
});

export type CreateCargoFormData = z.infer<typeof createCargoSchema>;
export type UpdateCargoFormData = z.infer<typeof updateCargoSchema>;
