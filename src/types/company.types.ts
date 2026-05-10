export interface Company {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
}

export interface CreateCompanyDto {
  title: string;
  description?: string | null;
}

export interface UpdateCompanyDto {
  title?: string;
  description?: string;
}

export interface Membership {
  id: string;
  user_id: string;
  company_id: string;
  role: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  company_id: string;
  created_at: Date;
  expires_at: Date;
}

export interface CreateInvitationDto {
  email: string;
  role: string;
}
