import { z } from 'zod';

export const deliveryTypes = ['land', 'water', 'air'] as const;

export const createVehicleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  deliveryType: z.enum(deliveryTypes),
});

export const updateVehicleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
  deliveryType: z.enum(deliveryTypes).optional(),
  cargoId: z.string().uuid('Invalid cargo ID').nullable().optional(),
});

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleFormData = z.infer<typeof updateVehicleSchema>;
