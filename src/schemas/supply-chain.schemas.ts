import { z } from 'zod';

// Supply Node Connection Schema
export const supplyNodeConnectionSchema = z.object({
  startNodeId: z.string().uuid('Invalid start node ID'),
  destinationNodeId: z.string().uuid('Invalid destination node ID'),
  distance: z.number().positive('Distance must be positive'),
});

// Create Supply Chain Schema
export const createSupplyChainSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  supply_node_connections: z.array(supplyNodeConnectionSchema).optional(),
});

// Update Supply Chain Schema
export const updateSupplyChainSchema = createSupplyChainSchema.partial();

// Form data types
export type CreateSupplyChainFormData = z.infer<typeof createSupplyChainSchema>;
export type UpdateSupplyChainFormData = z.infer<typeof updateSupplyChainSchema>;
export type SupplyNodeConnectionFormData = z.infer<typeof supplyNodeConnectionSchema>;
