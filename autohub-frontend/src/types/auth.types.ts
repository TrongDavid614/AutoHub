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

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  receiveMarketing?: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  resetToken: string;
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  code?: string;
  idToken?: string;
  redirectUri?: string;
}

