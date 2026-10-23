export type Role = 'ROLE_CUSTOMER' | 'ROLE_STAFF' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  identityCardNumber?: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  phoneNumber: string;
  provinceCity: string;
  district: string;
  ward: string;
  detailedAddress: string;
  isDefault: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}
