import { z } from 'zod';

export const createCompanySchema = z.object({
  title: z.string().min(1, 'Company name is required').max(100, 'Company name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
});

export const acceptInvitationSchema = z.object({
  invitationId: z.string().uuid('Invalid invitation ID'),
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;
