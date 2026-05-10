export interface User {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  company_id: string | null;
  role: string | null;
  is_admin: boolean;
}

export interface CreateUserDto {
  username: string;
  name: string;
  surname: string;
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
