export type Role = 'user' | 'admin';

export interface User {
  user_id: number;
  name: string;
  dome_mail: string;
  role: Role;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}