export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: string | null;
  role: string | null;
  is_admin: boolean;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}
