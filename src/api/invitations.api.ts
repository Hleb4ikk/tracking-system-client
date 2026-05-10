import apiClient from './client';

export interface Invitation {
  id: string;
  company_id: string;
  reciever_email: string;
  role: string;
  created_by: string;
  days_to_delete: number;
}

export interface CreateInvitationDto {
  recieverEmail: string;
  role: string;
  daysToDelete?: number;
}

export interface InvitationQuery {
  page: number;
  email?: string;
  createdBy?: string;
  role?: string;
}

export interface CreateInvitationResponse {
  message: string;
  invitation: Invitation;
}

export interface DeleteInvitationResponse {
  message: string;
}

export interface AcceptInvitationResponse {
  message: string;
}

export const invitationsApi = {
  // Get company invitations (co-founder, logistician only)
  getInvitations: async (query?: InvitationQuery): Promise<Invitation[]> => {
    const params = new URLSearchParams();
    params.append('page', query?.page?.toString() || '1');
    if (query?.email) params.append('email', query.email);
    if (query?.createdBy) params.append('createdBy', query.createdBy);
    if (query?.role) params.append('role', query.role);
    
    const response = await apiClient.get<Invitation[]>(
      `/invitations?${params.toString()}`
    );
    return response.data;
  },

  // Create invitation (co-founder, logistician only)
  createInvitation: async (data: CreateInvitationDto): Promise<CreateInvitationResponse> => {
    const response = await apiClient.post<CreateInvitationResponse>(
      '/invitations',
      data
    );
    return response.data;
  },

  // Delete invitation (co-founder, logistician only)
  deleteInvitation: async (invitationId: string): Promise<DeleteInvitationResponse> => {
    const response = await apiClient.delete<DeleteInvitationResponse>(
      `/invitations/${invitationId}`
    );
    return response.data;
  },

  // Accept an invitation
  acceptInvitation: async (invitationId: string): Promise<AcceptInvitationResponse> => {
    const response = await apiClient.patch<AcceptInvitationResponse>(
      `/invitations/${invitationId}/accept`
    );
    return response.data;
  },
};
