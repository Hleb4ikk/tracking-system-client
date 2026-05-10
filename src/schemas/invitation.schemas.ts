import { z } from 'zod';
import { ROLES } from '../constants';

export const createInvitationSchema = z.object({
  recieverEmail: z.string().email('Invalid email address'),
  role: z.enum([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR, ROLES.COURIER] as [string, ...string[]]),
  daysToDelete: z.number().int().min(1).max(30).optional(),
});

export type CreateInvitationFormData = z.infer<typeof createInvitationSchema>;
